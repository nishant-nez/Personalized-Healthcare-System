from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import mixins, generics, permissions
from django.views.decorators.csrf import csrf_exempt
from personalized_healthcare_system.settings.base import BASE_DIR
from rest_framework.exceptions import ValidationError
import requests
import os
import math
from dotenv import load_dotenv
import json

load_dotenv()

with open(os.path.join(BASE_DIR, 'hospitals_json', 'combined_hospitals.json'), encoding='utf-8') as f:
    hospital_data = json.load(f)
hospitals = hospital_data['results']

def search_hospitals(keyword, hospitals):
    keyword = keyword.lower()
    matching_hospitals = []
    
    for query in keyword.split(' '):
        for hospital in hospitals:
            # Check if the keyword is in the hospital's name, types, or address
            if (query.lower() != 'hospital' and query.lower() != 'clinic'):
                if (query in hospital.get('name', '').lower() or
                    any(query in t.lower() for t in hospital.get('types', [])) or
                    query in hospital.get('formatted_address', '').lower()):
                    matching_hospitals.append(hospital)
    return matching_hospitals


def nearest_hospitals_by_coordinates(lat, lng, hospitals):
    # Create a new list of hospitals with their distances
    hospitals_with_distance = [(hospital, math.sqrt((lat - hospital['geometry']['location']['lat']) ** 2 + (lng - hospital['geometry']['location']['lng']) ** 2)) for hospital in hospitals]

    # Sort the hospitals based on their distance
    hospitals_with_distance.sort(key=lambda x: x[1])

    # Create a new list of hospitals without the distance
    nearest_hospitals = [hospital for hospital, distance in hospitals_with_distance]

    return nearest_hospitals



class HospitalList(APIView):
    """
    Get all available hospitals within Kathmandu.
    """

    permission_classes = []

    def get(self, request, format=None):
        filtered_hospitals = hospitals
        if request.query_params.get('search'):
            filtered_hospitals = search_hospitals(request.query_params.get('search'), hospitals)
        if request.query_params.get('limit'):
            filtered_hospitals = filtered_hospitals[:int(request.query_params.get('limit'))]
        return Response(filtered_hospitals, status=status.HTTP_200_OK)


class NearestHospital(APIView):
    """
    Get the nearest hospital based on given coordinates and/or type.
    """

    permission_classes = []

    def get(self, request, format=None):
        lat = request.query_params.get('lat', None)
        lng = request.query_params.get('lng', None)
        type = request.query_params.get('type', None)
        limit = request.query_params.get('limit', None)

        filtered_hospitals = hospitals

        if not lat or not lng:
            raise ValidationError('Latitude and longitude are required.')
        
        if type:
            filtered_hospitals = search_hospitals(type, hospitals)
            if not filtered_hospitals:
                filtered_hospitals = hospitals
        # if request.query_params.get('limit'):
        #     filtered_hospitals = filtered_hospitals[:int(request.query_params.get('limit'))]
        nearest_hospitals = nearest_hospitals_by_coordinates(float(lat), float(lng), filtered_hospitals)
        
        if limit:
            limit = int(limit)
            nearest_hospitals = nearest_hospitals[:int(limit + 5)]

        # Calculate distance matrix from Maps API
        if nearest_hospitals:
            for i in range(0, len(nearest_hospitals)):
                url = f'https://maps.googleapis.com/maps/api/distancematrix/json?origins={lat},{lng}&destinations={nearest_hospitals[i]["geometry"]["location"]["lat"]},{nearest_hospitals[i]["geometry"]["location"]["lng"]}&key={os.environ.get("GOOGLE_MAP_API_KEY")}'
                response = requests.get(url)
                data = response.json()

                if data['status'] != 'OK':
                    raise ValidationError('Failed to calculate distance matrix.')
                nearest_hospitals[i]['origin_address'] = data['origin_addresses']
                nearest_hospitals[i]['destination_address'] = data['destination_addresses']
                nearest_hospitals[i]['distance'] = data['rows'][0]['elements'][0]['distance']
                nearest_hospitals[i]['duration'] = data['rows'][0]['elements'][0]['duration']
        
        nearest_hospitals.sort(key=lambda x: x['distance']['value'])
        if limit:
            nearest_hospitals = nearest_hospitals[:int(limit)]

        return Response(nearest_hospitals, status=status.HTTP_200_OK)
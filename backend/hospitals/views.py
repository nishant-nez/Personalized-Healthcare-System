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


def nearest_hospital_by_coordinates(lat, lng, hospitals):
    nearest_hospital = None
    nearest_distance = float('inf')

    for hospital in hospitals:
        hospital_lat = hospital['geometry']['location']['lat']
        hospital_lng = hospital['geometry']['location']['lng']
        distance = math.sqrt((lat - hospital_lat) ** 2 + (lng - hospital_lng) ** 2)
        if distance < nearest_distance:
            nearest_distance = distance
            nearest_hospital = hospital

    return nearest_hospital


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

        filtered_hospitals = hospitals

        if not lat or not lng:
            raise ValidationError('Latitude and longitude are required.')
        
        if type:
            filtered_hospitals = search_hospitals(type, hospitals)
            if not filtered_hospitals:
                filtered_hospitals = hospitals
        # if request.query_params.get('limit'):
        #     filtered_hospitals = filtered_hospitals[:int(request.query_params.get('limit'))]
        nearest_hospital = nearest_hospital_by_coordinates(float(lat), float(lng), filtered_hospitals) 

        # Calculate distance matrix from Maps API
        if nearest_hospital:
            url = f'https://maps.googleapis.com/maps/api/distancematrix/json?origins={lat},{lng}&destinations={nearest_hospital["geometry"]["location"]["lat"]},{nearest_hospital["geometry"]["location"]["lng"]}&key={os.environ.get("GOOGLE_MAP_API_KEY")}'
            response = requests.get(url)
            data = response.json()

            if data['status'] != 'OK':
                raise ValidationError('Failed to calculate distance matrix.')
            nearest_hospital['origin_address'] = data['origin_addresses']
            nearest_hospital['destination_address'] = data['destination_addresses']
            nearest_hospital['distance'] = data['rows'][0]['elements'][0]['distance']
            nearest_hospital['duration'] = data['rows'][0]['elements'][0]['duration']

        return Response(nearest_hospital, status=status.HTTP_200_OK)
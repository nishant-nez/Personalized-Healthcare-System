from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
import requests
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_MAP_API_KEY = os.environ.get('GOOGLE_MAP_API_KEY')


def fetch_nearby_hospitals(lat, lng, radius=5000, keyword=None, page_token=None):
    url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
    params = {
        'location': f'{lat},{lng}',
        'radius': radius,
        'type': 'hospital',
        'key': GOOGLE_MAP_API_KEY,
    }
    if keyword:
        params['keyword'] = keyword
    if page_token:
        params['pagetoken'] = page_token

    response = requests.get(url, params=params)
    return response.json()


def get_photo_url(photo_reference, max_width=800):
    return f'https://maps.googleapis.com/maps/api/place/photo?maxwidth={max_width}&photoreference={photo_reference}&key={GOOGLE_MAP_API_KEY}'


def get_distance_matrix(origin_lat, origin_lng, destinations):
    dest_str = '|'.join(
        f'{h["geometry"]["location"]["lat"]},{h["geometry"]["location"]["lng"]}'
        for h in destinations
    )
    url = 'https://maps.googleapis.com/maps/api/distancematrix/json'
    params = {
        'origins': f'{origin_lat},{origin_lng}',
        'destinations': dest_str,
        'key': GOOGLE_MAP_API_KEY,
    }
    response = requests.get(url, params=params)
    return response.json()


def format_hospital(hospital):
    result = {
        'place_id': hospital.get('place_id', ''),
        'name': hospital.get('name', ''),
        'formatted_address': hospital.get('vicinity', ''),
        'geometry': hospital.get('geometry', {}),
        'rating': hospital.get('rating', 0),
        'user_ratings_total': hospital.get('user_ratings_total', 0),
        'business_status': hospital.get('business_status', ''),
        'types': hospital.get('types', []),
        'opening_hours': hospital.get('opening_hours', {}),
        'icon': hospital.get('icon', ''),
        'photo_url': '',
    }
    photos = hospital.get('photos', [])
    if photos:
        result['photo_url'] = get_photo_url(photos[0].get('photo_reference', ''))
    return result


class NearbyHospitals(APIView):
    """
    Fetch nearby hospitals using Google Places API based on live coordinates.
    Works for any country.
    """
    permission_classes = []

    def get(self, request):
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        keyword = request.query_params.get('search', None)
        radius = request.query_params.get('radius', 5000)
        limit = int(request.query_params.get('limit', 20))

        if not lat or not lng:
            raise ValidationError('Latitude and longitude are required.')

        data = fetch_nearby_hospitals(lat, lng, radius=radius, keyword=keyword)

        if data.get('status') not in ('OK', 'ZERO_RESULTS'):
            return Response(
                {'error': f'Google Places API error: {data.get("status")}'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        raw_hospitals = data.get('results', [])[:limit]
        hospitals = [format_hospital(h) for h in raw_hospitals]

        return Response(hospitals, status=status.HTTP_200_OK)


class NearbyHospitalsWithDistance(APIView):
    """
    Fetch nearby hospitals with distance/duration from user's location.
    Works for any country.
    """
    permission_classes = []

    def get(self, request):
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        keyword = request.query_params.get('search', None)
        radius = request.query_params.get('radius', 5000)
        limit = int(request.query_params.get('limit', 10))

        if not lat or not lng:
            raise ValidationError('Latitude and longitude are required.')

        data = fetch_nearby_hospitals(lat, lng, radius=radius, keyword=keyword)

        if data.get('status') not in ('OK', 'ZERO_RESULTS'):
            return Response(
                {'error': f'Google Places API error: {data.get("status")}'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        raw_hospitals = data.get('results', [])
        hospitals = [format_hospital(h) for h in raw_hospitals]

        if not hospitals:
            return Response([], status=status.HTTP_200_OK)

        # Distance Matrix API supports max 25 destinations per request
        batch_size = 25
        for i in range(0, len(hospitals), batch_size):
            batch = raw_hospitals[i:i + batch_size]
            dm_data = get_distance_matrix(lat, lng, batch)

            if dm_data.get('status') != 'OK':
                continue

            origin_address = dm_data.get('origin_addresses', [''])[0]
            elements = dm_data['rows'][0]['elements']

            for j, element in enumerate(elements):
                idx = i + j
                if idx >= len(hospitals):
                    break
                hospitals[idx]['origin_address'] = [origin_address]
                hospitals[idx]['destination_address'] = dm_data.get('destination_addresses', [''])[j:j+1]
                if element.get('status') == 'OK':
                    hospitals[idx]['distance'] = element.get('distance', {})
                    hospitals[idx]['duration'] = element.get('duration', {})
                else:
                    hospitals[idx]['distance'] = {'text': 'N/A', 'value': 999999}
                    hospitals[idx]['duration'] = {'text': 'N/A', 'value': 999999}

        # Sort by distance and apply limit
        hospitals.sort(key=lambda x: x.get('distance', {}).get('value', 999999))
        hospitals = hospitals[:limit]

        return Response(hospitals, status=status.HTTP_200_OK)

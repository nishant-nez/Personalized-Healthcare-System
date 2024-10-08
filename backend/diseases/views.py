from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import mixins, generics, permissions
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from personalized_healthcare_system.settings.base import BASE_DIR
from .serializers import DiseaseHistorySerializer
from .models import DiseaseHistory
from .permissions import IsOwnerOrReadOnly, IsAdminOrReadOnly, IsOwnerOrAdmin
import os

import pandas as pd
import pickle
import numpy as np
# import sklearn

major_symptoms = [
    "itching",
    "skin_rash",
    "nodal_skin_eruptions",
    "continuous_sneezing",
    "shivering",
    "chills",
    "joint_pain",
    "stomach_pain",
    "acidity",
    "ulcers_on_tongue",
    "muscle_wasting",
    "vomiting",
    "burning_micturition",
    "spotting_ urination",
    "fatigue",
    "weight_gain",
    "anxiety",
    "cold_hands_and_feets",
    "mood_swings",
    "weight_loss",
    "restlessness",
    "lethargy",
    "patches_in_throat",
    "irregular_sugar_level",
    "cough",
    "high_fever",
    "sunken_eyes",
    "breathlessness",
    "sweating",
    "dehydration",
    "indigestion",
    "headache",
    "yellowish_skin",
    "dark_urine",
    "nausea",
    "loss_of_appetite",
    "pain_behind_the_eyes",
    "back_pain",
    "constipation",
    "abdominal_pain",
    "diarrhoea",
    "mild_fever",
    "yellow_urine",
    "yellowing_of_eyes",
    "acute_liver_failure",
    "fluid_overload",
    "swelling_of_stomach",
    "swelled_lymph_nodes",
    "malaise",
    "blurred_and_distorted_vision",
    "phlegm",
    "throat_irritation",
    "redness_of_eyes",
    "sinus_pressure",
    "runny_nose",
    "congestion",
    "chest_pain",
    "weakness_in_limbs",
    "fast_heart_rate",
    "pain_during_bowel_movements",
    "pain_in_anal_region",
    "bloody_stool",
    "irritation_in_anus",
    "neck_pain",
    "dizziness",
    "cramps",
    "bruising",
    "obesity",
    "swollen_legs",
    "swollen_blood_vessels",
    "puffy_face_and_eyes",
    "enlarged_thyroid",
    "brittle_nails",
    "swollen_extremeties",
    "excessive_hunger",
    "extra_marital_contacts",
    "drying_and_tingling_lips",
    "slurred_speech",
    "knee_pain",
    "hip_joint_pain",
    "muscle_weakness",
    "stiff_neck",
    "swelling_joints",
    "movement_stiffness",
    "spinning_movements",
    "loss_of_balance",
    "unsteadiness",
    "weakness_of_one_body_side",
    "loss_of_smell",
    "bladder_discomfort",
    "foul_smell_of urine",
    "continuous_feel_of_urine",
    "passage_of_gases",
    "internal_itching",
    "toxic_look_(typhos)",
    "depression",
    "irritability",
    "muscle_pain",
    "altered_sensorium",
    "red_spots_over_body",
    "belly_pain",
    "abnormal_menstruation",
    "dischromic _patches",
    "watering_from_eyes",
    "increased_appetite",
    "polyuria",
    "family_history",
    "mucoid_sputum",
    "rusty_sputum",
    "lack_of_concentration",
    "visual_disturbances",
    "receiving_blood_transfusion",
    "receiving_unsterile_injections",
    "coma",
    "stomach_bleeding",
    "distention_of_abdomen",
    "history_of_alcohol_consumption",
    "fluid_overload.1",
    "blood_in_sputum",
    "prominent_veins_on_calf",
    "palpitations",
    "painful_walking",
    "pus_filled_pimples",
    "blackheads",
    "scurring",
    "skin_peeling",
    "silver_like_dusting",
    "small_dents_in_nails",
    "inflammatory_nails",
    "blister",
    "red_sore_around_nose",
    "yellow_crust_ooze",
]

# Load Model
svc = pickle.load(open(os.path.join(BASE_DIR, 'models', 'svc.pkl'), 'rb'))
# Load Datasets
symtom_des = pd.read_csv(os.path.join(BASE_DIR, "datasets" ,"symtoms_df.csv"))
precautions = pd.read_csv(os.path.join(BASE_DIR, "datasets" ,"precautions_df.csv"))
workout = pd.read_csv(os.path.join(BASE_DIR, "datasets" ,"workout_df.csv"))
description = pd.read_csv(os.path.join(BASE_DIR, "datasets" ,"description.csv"))
medications = pd.read_csv(os.path.join(BASE_DIR, "datasets" ,"medications.csv"))
diets = pd.read_csv(os.path.join(BASE_DIR, "datasets" ,"diets.csv"))
symptom_sev = pd.read_csv(os.path.join(BASE_DIR, "datasets" ,"Symptom-severity.csv"))



def helper(disease):
    desc = description[description['Disease'] == disease]['Description']
    desc = " ".join([w for w in desc])

    pre = precautions[precautions['Disease'] == disease][['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']]
    pre = list([col for col in pre.values][0])

    med = medications[medications['Disease'] == disease]['Medication']
    med = [med for med in med.values][0].strip("[]").replace("'", "").split(", ")

    die = diets[diets['Disease'] == disease]['Diet']
    die = [die for die in die.values][0].strip("[]").replace("'", "").split(", ")

    workouts = workout[workout['disease'] == disease]['workout']
    workouts = [workout for workout in workouts.values]

    return desc, pre, med, die, workouts



class PredictDisease(APIView):
    """
    Predict new disease based on given symptoms.
    """

    permission_classes = []

    def post(self, request, format=None):

        symptoms_list = np.zeros(len(major_symptoms))
        symptom_severity = {}

        for symp in request.data["symptoms"]:
            symp = symp.lower().replace(' ', '_')
            major_symptoms_1d = np.atleast_1d(major_symptoms)  # Ensure it's at least 1D to avoid value error

            indx = np.where(major_symptoms_1d == symp)[0]
            if indx.size > 0:
                symptoms_list[indx] = 1

            symptom_weight = symptom_sev[symptom_sev['Symptom'] == symp]['weight'].values
            if symptom_weight.size > 0:
                symptom_severity[symp] = symptom_weight[0]

        disease = svc.predict(symptoms_list.reshape(1, -1))[0]
        disease_info = helper(disease)

        result = {
            "Disease": disease,
            "Description": disease_info[0],
            "Precautions": disease_info[1],
            "Medications": disease_info[2],
            "Diet": disease_info[3],
            "Workouts": disease_info[4],
            "Severity": symptom_severity,
        }

        if request.user.is_authenticated:
            data = {
                "name": disease,
                "symptoms": str(request.data["symptoms"]),
                "user": request.user.id,
            }
            serializer = DiseaseHistorySerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            else:
                print(serializer.errors)
        
        return Response(result)


class DiseaseList(generics.ListAPIView):
    """
    List all disease history instances.
    """
    queryset = DiseaseHistory.objects.all()
    serializer_class = DiseaseHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return DiseaseHistory.objects.all()
        return DiseaseHistory.objects.filter(user=self.request.user)


class DiseaseHistoryDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a disease history instance.
    """
    queryset = DiseaseHistory.objects.all()
    serializer_class = DiseaseHistorySerializer
    permission_classes = [IsOwnerOrAdmin]

    def get_queryset(self):
        return DiseaseHistory.objects.filter(user=self.request.user)
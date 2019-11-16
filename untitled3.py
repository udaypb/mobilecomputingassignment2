# -*- coding: utf-8 -*-
"""
Created on Thu Nov 14 22:07:39 2019

@author: smpsh
"""

import numpy as np
import pandas as pd 
from sklearn.externals import joblib



new_data = pd.read_csv("video.csv")
model_1 = joblib.load("rf2.pkl")
model_2 = joblib.load("dc2.pkl")
#model_3 = joblib.load("xgb.pkl")
encoder = joblib.load("enc2.pkl")
prediction = model_1.predict(new_data)
prediction_category = pd.DataFrame(encoder.inverse_transform(prediction),columns = ['class'])
value_count = pd.DataFrame(prediction_category['class'].value_counts(),columns = ['class'])
result_1 = list(value_count[value_count['class']==value_count['class'].max()].index)[0]

# print (value_count)

prediction_2 = model_2.predict(new_data)
prediction_category_2 = pd.DataFrame(encoder.inverse_transform(prediction_2),columns = ['class'])
value_count_2 = pd.DataFrame(prediction_category_2['class'].value_counts(),columns = ['class'])
result_2 = list(value_count_2[value_count_2['class']==value_count_2['class'].max()].index)[0]
# print (value_count_2)

print (result_1,result_2)



#
#a = pd.concat([mmm,pd.DataFrame([90],index = ['buy'])],axis = 0)
#z = prediction_category['class'].append(pd.DataFrame(['buy']*100))
#prediction_category['class'].max()
#
#aa = a[a[0]==a[0].max()]
#aaa = list(aa.index)

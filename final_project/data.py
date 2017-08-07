import pandas as pd
import numpy as np
import scipy as sci


foodWeights = "/Users/Anthony/Desktop/foodWeights.csv"
foodData = "/Users/Anthony/Desktop/foodData.csv"
foodGroups = "/Users/Anthony/Desktop/foodGroups.csv"


data_df = pd.read_csv(foodData,encoding = 'latin-1')
group_df = pd.read_csv(foodGroups,encoding= 'latin-1',header= None)

col = list(data_df)

for i in range(0,len(col)):
    col[i] = str(col[i]).replace('_'," ")


data_df.columns = col
'''print(list(data_df))'''
data_df = data_df.fillna(value = -5)
group_df.columns = ['groupID','description']

for i in range(0,len(group_df['groupID'])):
    group_df['groupID'][i] = group_df['groupID'][i].replace("~","")
    group_df['description'][i] = group_df['description'][i].replace("~", "")



groups = ['Other'] * len(data_df['NDB No'])
for i in range(0,len(group_df['groupID'])):
    for j in range(0,len(data_df['NDB No'])):

        if(int(data_df['NDB No'][j]) < 10000):
            if('0' + str(data_df['NDB No'][j])[:1] == str(group_df['groupID'][i])[:2]):
                groups[j] = group_df['description'][i]
        elif (int(data_df['NDB No'][j]) >= 10000):
            if (str(data_df['NDB No'][j])[:2] == str(group_df['groupID'][i])[:2]):
                groups[j] = group_df['description'][i]
            elif (int(data_df['NDB No'][j]) >= 23000 and int(data_df['NDB No'][j]) < 24000):
                groups[j] = 'Beef Products'
            elif (int(data_df['NDB No'][j]) >= 27000 and int(data_df['NDB No'][j]) < 28000):
                groups[j] = 'Soups, Sauces, and Gravies'
            elif (int(data_df['NDB No'][j]) >= 28000 and int(data_df['NDB No'][j]) < 29000):
                groups[j] = 'Sweets'
            elif (int(data_df['NDB No'][j]) >= 31001 and int(data_df['NDB No'][j]) <= 31013):
                groups[j] = 'Vegetables and Vegetable Products'
            elif (int(data_df['NDB No'][j]) >= 33862 and int(data_df['NDB No'][j]) <= 33879):
                groups[j] = 'Baby Foods'
            elif (int(data_df['NDB No'][j]) >= 31019 and int(data_df['NDB No'][j]) <= 31036):
                groups[j] = 'Vegetables and Vegetable Products'

data_df['group'] = groups

data_df.to_csv("newData2.csv")





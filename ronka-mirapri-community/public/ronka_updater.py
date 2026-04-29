import pandas as pd
import os
import json
import requests

#github에서 item.csv 갱신
github_item_url = "https://raw.githubusercontent.com/Ra-Workspace/ffxiv-datamining-ko/master/csv/Item.csv"
res = requests.get(github_item_url)
res.raise_for_status()

with open('public/item.csv', "wb") as f:
    f.write(res.content)

#CSV raw data 읽어오기
raw_data = pd.read_csv('public/item.csv', header=1, index_col=0)
raw_data.drop(['int32', '0'], axis=0, inplace=True)

#필요한 행(이름, 아이콘, 염색 수, ...)만 잘라서 items로 저장
items = raw_data[['Singular', 'Icon', 'DyeCount', 'ClassJobCategory', 'EquipSlotCategory']].copy()
items.index = pd.to_numeric(items.index)
items['Singular'] = items['Singular'].astype('string')
items['Icon'] = items['Icon'].astype('string')
items['DyeCount'] = pd.to_numeric(items['DyeCount'])
items['ClassJobCategory'] = pd.to_numeric(items['ClassJobCategory'])
items['EquipSlotCategory'] = pd.to_numeric(items['EquipSlotCategory'])

#착용가능한(equip slot category이 지정됨 + class job category가 지정됨) 아이템 필터링
equipable_items = items[(items['EquipSlotCategory'] != 0) & (items['ClassJobCategory'] != 0)].copy()

#필요 없는 아이템 삭제
equipable_items.dropna(subset=['Singular'], inplace=True)
equipable_items.drop(axis=0, index=equipable_items[equipable_items['Singular'].str.contains(r'^햇살의')].index, inplace=True)
equipable_items.drop(axis=0, index=equipable_items[equipable_items['Singular'].str.contains(r'^햇빛살')].index, inplace=True)
equipable_items.drop(axis=0, index=equipable_items[equipable_items['Singular'].str.contains(r'^안개돋이')].index, inplace=True)
equipable_items.drop(axis=0, index=equipable_items[equipable_items['Singular'].str.contains(r'^짙은안개')].index, inplace=True)
equipable_items.drop(axis=0, index=equipable_items[equipable_items['Singular'].str.contains(r'^안개넘이')].index, inplace=True)
equipable_items.drop(axis=0, index=equipable_items[equipable_items['Singular'].str.contains(r'^에테르 깃든')].index, inplace=True)
equipable_items.drop(axis=0, index=equipable_items[equipable_items['Singular'].str.contains(r'^구식')].index, inplace=True)

#스타일카탈로그 (안경 시리즈) 아이템 필터링, 염색 수, 장착슬롯, 장착클래스 등 지정
style_items = items[items['Singular'].str.contains('스타일카탈로그: ')].copy()
style_items.loc[style_items.index, 'DyeCount'] = 1
style_items.loc[style_items.index, 'ClassJobCategory'] = 1
style_items.loc[style_items.index, 'EquipSlotCategory'] = 24

#착용가능한 아이템 + 스타일카탈로그를 합친 데이터
filtered_items = pd.concat([equipable_items, style_items])

#아이콘 넘버링을 경로로 수정
filtered_items['IconNumber'] = filtered_items['Icon']
filtered_items['Icon'] = '/i/0' + filtered_items['Icon'].str[:2] + '000/0' + filtered_items['Icon'] + '_hr1.png'

#실장 안된 이벤트 아이템 필터링(할 때마다 수정해주세요)
filtered_items.drop(axis=0, index=filtered_items[filtered_items.Singular.str.contains('제로 광명')].index, inplace=True)
filtered_items.drop(axis=0, index=filtered_items[filtered_items.Singular.str.contains('신생 연왕국 시민')].index, inplace=True)

#index를 id로, 컬럼명 수정
filtered_items.reset_index(inplace=True)
filtered_items.columns = ['Id', 'Name', 'Icon', 'DyeCount', 'ClassJobCategory', 'EquipSlotCategory', 'IconNumber']

#json으로 저장
records = filtered_items.to_dict(orient='records')
with open('app/json/filtered_items.json', 'w', encoding='utf-8') as f:
    json.dump(records, f, indent=2, ensure_ascii=False)

#이미지 파일 다운로드
length = len(filtered_items['Icon'])
for i, (url, number) in enumerate(zip(filtered_items['Icon'], filtered_items['IconNumber'])):
    path = 'public/' +'/'.join(url.split('/')[:-1])
    filename = url.split('/')[-1]
    api_url = f'asset?path={"ui/icon/0" + number[:2] + "000/0" + number + "_hr1.tex"}&format=png'
    
    if not os.path.exists(path):
        os.makedirs(path)

    if not os.path.exists(os.path.join(path, filename)):
        pass
        os.system(f'curl -o {os.path.join(path, filename)} "https://v2.xivapi.com/api/{api_url}"')    
        print(f'\r{i/length: .2%} {i} / {length}: {number}', end='')
print('image download done!')

#python public/ronka_updater.py
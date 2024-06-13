import time
import csv
import os
from selenium import webdriver
from bs4 import BeautifulSoup
import subprocess

product_urls = {
    'Sapphire NITRO+ Radeon RX 7800 XT': 'https://pt.pcpartpicker.com/product/N4P8TW/sapphire-nitro-radeon-rx-7800-xt-16-gb-video-card-11330-01-20g',
    'PowerColor Hellhound OC Radeon RX 7800 XT': 'https://pt.pcpartpicker.com/product/BtkH99/powercolor-hellhound-oc-radeon-rx-7800-xt-16-gb-video-card-rx-7800-xt-16g-loc',
    'ASRock Challenger OC Radeon RX 7800 XT' : 'https://pt.pcpartpicker.com/product/rfV2FT/asrock-challenger-oc-radeon-rx-7800-xt-16-gb-video-card-rx7800xt-cl-16go',
    'ASRock Phantom Gaming OC Radeon RX 7800 XT' : 'https://pt.pcpartpicker.com/product/2NsV3C/asrock-phantom-gaming-oc-radeon-rx-7800-xt-16-gb-video-card-rx7800xt-pg-16go',
    'XFX Speedster QICK 319 Core Radeon RX 7800 XT':'https://pt.pcpartpicker.com/product/GYfxFT/xfx-speedster-qick-319-core-radeon-rx-7800-xt-16-gb-video-card-rx-78tqickf9',
    'XFX Speedster MERC 319 Black Radeon RX 7800 XT':'https://pt.pcpartpicker.com/product/MQwmP6/xfx-speedster-merc-319-black-radeon-rx-7800-xt-16-gb-video-card-rx-78tmercb9',
    'PowerColor Red Devil OC Radeon RX 7800 XT':'https://pt.pcpartpicker.com/product/zdMMnQ/powercolor-red-devil-oc-radeon-rx-7800-xt-16-gb-video-card-rx-7800-xt-16g-eoc'
}

ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36" # Preciso para passar a verificação do site

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--headless=new")
chrome_options.add_argument(f'user-agent={ua}')
driver = webdriver.Chrome(options=chrome_options)

csv_file_path = "docs/assets/prices.csv"

if os.path.exists(csv_file_path):
    with open(csv_file_path, mode='r', newline='', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        rows = [row for row in csv_reader]

else:
    rows = []
    rows.append(['Product', 'Price', 'Date'])
    
current_date = time.strftime("%d/%m/%Y - %H:%M:%S")

for product_name, url in product_urls.items():
    driver.get(url)
    html_source = driver.page_source
    soup = BeautifulSoup(html_source, 'html.parser')
    td_tag = soup.find('td', class_='td__finalPrice')
    
    if td_tag:
        a_tag = td_tag.find('a')
        if a_tag:
            price = a_tag.text.strip()
            merchant_tag = a_tag.get('data-merchant-tag')
            link = a_tag.get('href')
            
    
    print(product_name, "->", price + "€ (" + merchant_tag + ")")
        
    existing_row = next((row for row in rows if row[0] == product_name), None)
    
    if existing_row:
        existing_row[2] = existing_row[1]
        existing_row[1] = price
        existing_row[2] = merchant_tag
        existing_row[3] = link
        existing_row[4] = current_date
    else:
        new_row = [product_name, price, merchant_tag, link, current_date]
        rows.append(new_row)
        
with open(csv_file_path, mode='w', newline='', encoding='utf-8') as file:
    csv_writer = csv.writer(file)
    csv_writer.writerows(rows)
    

driver.quit()

try:
    # Switch to the gh-pages branch
    subprocess.run(["git", "checkout", "gh-pages"], check=True)

    # Pull latest changes from gh-pages branch
    subprocess.run(["git", "pull", "origin", "gh-pages"], check=True)

    # Modify the CSV file (e.g., update it programmatically)

    # Add the updated CSV file
    subprocess.run(["git", "add", csv_file_path], check=True)

    # Commit the changes
    subprocess.run(["git", "commit", "-m", f"Update CSV file {current_date}"], check=True)

    # Push the changes to the remote gh-pages branch
    subprocess.run(["git", "push", "origin", "gh-pages"], check=True)
except subprocess.CalledProcessError as e:
    print("Error:", e)
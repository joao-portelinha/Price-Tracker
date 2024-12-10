
# Price Tracker

## Not running this anymore but it still works.

Python script that will scrape especific PCPartPicker item pages to get the best current price for each of the items to a .CSV file. Angular web page that will read and display the data from the .CSV file.

The Python script will run every time i turn my computer on and will commit/push the updated .CSV file to the docs folder where it will update the GitHub Pages webpage (joao-portelinha.github.io/Price-Tracker/). The Webpage necessary code & updated .CSV are pushed to the gh-pages branch so that the main branch will only have important changes to the actual project code without having the daily .CSV updates mixed in.
STILL WIP


## Stack

**Front-end:** Angular, TailwindCSS

**"Back-end":** Python, Selenium, BeautifulSoup


## Screenshots
![Python Script](https://i.ibb.co/1RBrrdT/Captura-de-ecr-2024-04-28-142400.png)

![Web Page](https://i.ibb.co/VvmBp8W/Captura-de-ecr-2024-04-28-142431.png)

## TODO  

- [ ] Dark Mode.  
- [ ] Table order by price, name, etc .  
- [ ] JUST AN IDEIA: add a page for each product where it's possible to see more price data, like highest, lowest, graph, etc.

const UI = {

    domSelection(){
        let currencyAmount = document.querySelector('.selected-country-currency-amount');
        let selectedCountryName = document.querySelector('.selected-country-name');
        let convertedCurrency = document.querySelector('.converted-currency');
        let convertedCountryName = document.querySelector('.converted-country-name');
        let currencyName = document.querySelector('.currency-name');
        let inputCurrency = document.querySelector('.input-currency');
        let getInputCurrency = document.querySelector('.get-currency');
        let selectedCountry = document.querySelector('.from-selected-country');
        let convertedCountry = document.querySelector('.to-selected-country');
        let selectOption = document.querySelectorAll('select')

        return {
            currencyAmount,
            selectedCountryName,
            convertedCurrency,
            convertedCountryName,
            currencyName,
            inputCurrency,
            getInputCurrency,
            selectedCountry,
            convertedCountry,
            selectOption
        }
    },

    getCountryList(){

        let {selectedCountry, convertedCountry, selectOption, getInputCurrency, inputCurrency, currencyAmount, selectedCountryName, convertedCurrency, convertedCountryName} = this.domSelection();

        if(!localStorage.getItem('country-list')){
            // fetch('https://free.currconv.com/api/v7/currencies?apiKey=20b2a9a3ec5560b2b345')
            fetch('https://free.currconv.com/api/v7/currencies?apiKey=5b8ac88af0572fb8742a')
            .then(response => response.json())
            .then(response => {

                let values = Object.values(response.results)
                let localCountryList = [];

                for( let countryItem of values){
                    let country = {
                        countryName: countryItem.currencyName,
                        id: countryItem.id,
                    }
                    localCountryList.push(country);
                }
                localStorage.setItem('country-list', JSON.stringify(localCountryList));

                let getLocalCountry = JSON.parse(localStorage.getItem('country-list'));
                for(let item of getLocalCountry){
                    selectedCountry.innerHTML += `<option value="${item.id}">${item.countryName}</option>`;
                    convertedCountry.innerHTML += `<option value="${item.id}">${item.countryName}</option>`;
                }
            })
            .catch(err => console.error(err));
        }else{
            document.addEventListener('DOMContentLoaded', function(){
                let getLocalCountry = JSON.parse(localStorage.getItem('country-list'));
                getLocalCountry.sort(function(a, b){
                    if(a.countryName < b.countryName) { return -1; }
                    if(a.countryName > b.countryName) { return 1; }
                    return 0;
                })
                for(let item of getLocalCountry){
                    selectedCountry.innerHTML += `<option value="${item.id}">${item.countryName}</option>`;
                    convertedCountry.innerHTML += `<option value="${item.id}">${item.countryName}</option>`;
                }

                inputCurrency.value = 1;
                currencyAmount.textContent = inputCurrency.value;
                selectedCountryName.textContent = selectedCountry.options[selectedCountry.selectedIndex].text;
                convertedCountryName.textContent = convertedCountry.options[convertedCountry.selectedIndex].text;

                let selected = selectedCountry.options[selectedCountry.selectedIndex].value;
                let converTo = convertedCountry.options[convertedCountry.selectedIndex].value;
                fetch(`https://free.currconv.com/api/v7/convert?q=${selected}_${converTo}&compact=ultra&apiKey=5b8ac88af0572fb8742a`)
                .then(response => response.json())
                .then(response => {
                    let currVal = Object.values(response);
                    getInputCurrency.value = inputCurrency.value * currVal;
                })
                .catch(err => console.error(err));
                setTimeout(()=>{
                    convertedCurrency.textContent = getInputCurrency.value;
                }, 1000)
            })
        }
    },

    changeCurrencyValue(){
        let {selectedCountry, convertedCountry, selectOption, getInputCurrency, inputCurrency, currencyAmount, selectedCountryName, convertedCurrency, convertedCountryName} = this.domSelection();

        selectedCountry.addEventListener('change', event => {
            let selected = selectedCountry.options[selectedCountry.selectedIndex].value;
            let converTo = convertedCountry.options[convertedCountry.selectedIndex].value;
            currencyAmount.textContent = inputCurrency.value;
            selectedCountryName.textContent = selectedCountry.options[selectedCountry.selectedIndex].text;

            fetch(`https://free.currconv.com/api/v7/convert?q=${selected}_${converTo}&compact=ultra&apiKey=5b8ac88af0572fb8742a`)
            .then(response => response.json())
            .then(response => {
                let currVal = Object.values(response);
                getInputCurrency.value = inputCurrency.value * currVal;
                convertedCurrency.textContent = getInputCurrency.value;
            })
            .catch(err => console.error(err));
        });

        convertedCountry.addEventListener('change', event => {
            let selected = selectedCountry.options[selectedCountry.selectedIndex].value;
            let converTo = convertedCountry.options[convertedCountry.selectedIndex].value;

            fetch(`https://free.currconv.com/api/v7/convert?q=${selected}_${converTo}&compact=ultra&apiKey=5b8ac88af0572fb8742a`)
            .then(response => response.json())
            .then(response => {
                let currVal = Object.values(response);
                getInputCurrency.value = inputCurrency.value * currVal;
            })
            .catch(err => console.error(err));

            setTimeout(()=> {
                convertedCurrency.textContent = getInputCurrency.value;
            }, 1000)
            convertedCountryName.textContent = convertedCountry.options[convertedCountry.selectedIndex].text;
        });

        inputCurrency.addEventListener('keyup', function(){
            let selected = selectedCountry.options[selectedCountry.selectedIndex].value;
            let converTo = convertedCountry.options[convertedCountry.selectedIndex].value;
            fetch(`https://free.currconv.com/api/v7/convert?q=${selected}_${converTo}&compact=ultra&apiKey=5b8ac88af0572fb8742a`)
            .then(response => response.json())
            .then(response => {
                let currVal = Object.values(response);
                getInputCurrency.value = inputCurrency.value * currVal;
            })
            .catch(err => console.error(err));
        })

        getInputCurrency.addEventListener('keyup', function(){
            let selected = selectedCountry.options[selectedCountry.selectedIndex].value;
            let converTo = convertedCountry.options[convertedCountry.selectedIndex].value;
            fetch(`https://free.currconv.com/api/v7/convert?q=${converTo}_${selected}&compact=ultra&apiKey=5b8ac88af0572fb8742a`)
            .then(response => response.json())
            .then(response => {
                let currVal = Object.values(response);
                inputCurrency.value = getInputCurrency.value * currVal;
            })
            .catch(err => console.error(err));
        })


    },

}

UI.getCountryList();
UI.changeCurrencyValue();


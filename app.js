var budgetControl = (function () {

    var Expenses = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    }
    var Incomes = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allitems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
    }

    return {
        additem: function (type, description, value) {

            var newItem, ID;

            if (data.allitems[type].length === 0) {
                ID = 0;
            } else {
                ID = data.allitems[type][data.allitems[type].length - 1].id + 1;
            }
            if (type === "exp") {
                newItem = new Expenses(ID, description, value);
            } else {
                newItem = new Incomes(ID, description, value);
            }

            data.allitems[type].push(newItem);
            // console.log(newItem)
            return newItem;

        },
        calcbudget: function () {
            var sum = 0;
            data.allitems['inc'].forEach(element => {
                sum = parseInt(element.value) + sum;
                // console.log(sum);
            });
            var exp = 0;
            data.allitems['exp'].forEach(element => {
                exp = parseInt(element.value) + exp;
            });
            data.totals['exp'] = exp;
            data.totals['inc'] = sum;
            return {
                overall: (sum - exp),
                sum: sum,
                exp: exp
            }
            // console.log(data.totals['exp']);
            // console.log(data.totals['inc']);
        },


    }


})();













var UIcontrol = (function () {

    var DOMStrings = {
        addbutton: '.add__btn',
        description: '.add__description',
        value: '.add__value',
        type: '.add__type',
        incomeLabel: '.income-list',
        expenseLabel: '.expense-list',
        budget: '.budget_value',
        income: '.budget__income--value',
        expense: '.budget__expenses--value',
        delete: '.item__delete--btn'
    }

    return {
        getinput: function () {

            return {
                description: document.querySelector(DOMStrings.description).value,
                value: document.querySelector(DOMStrings.value).value,
                type: document.querySelector(DOMStrings.type).value
            }

        },
        inputDisplay: function (item, type) {
            var element, html, newHtml;

            if (type === "exp") {
                element = DOMStrings.expenseLabel;
                html = '<div class="exp" id="exp-%id%"><p class = "head" > %description% </p> <p class = "expense"> %value% </p> <button class = "item__delete--btn" > <i class = "ion-ios-close-outline" > </i></button></div>'

            } else {
                html = '<div class="inc" id="inc-%id%"><p class = "head" > %description% </p> <p class = "income"> %value% </p> <button class = "item__delete--btn" > <i class = "ion-ios-close-outline" > </i></button></div>'
                element = DOMStrings.incomeLabel;
            }
            console.log(item);
            // console.log("in function inp" + item);
            newHtml = html.replace('%id%', item.id);
            newHtml = newHtml.replace('%description%', item.description);
            newHtml = newHtml.replace('%value%', item.value, type);
            console.log(newHtml);
            console.log(element);
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);




        },
        displayBud: function (budget) {
            document.querySelector(DOMStrings.budget).textContent = budget.overall;
            document.querySelector(DOMStrings.income).textContent = budget.sum;
            document.querySelector(DOMStrings.expense).textContent = budget.exp;

        },
        clearfields: function () {
            var items, fieldsarr;

            items = document.querySelectorAll(DOMStrings.description + ',' + DOMStrings.value);

            fieldsarr = Array.prototype.slice.call(items);

            fieldsarr.forEach(function (i) {
                i.value = "";
            })

            fieldsarr[0].focus();


        },
        getDom: function () {
            return DOMStrings;
        }
    }
})();












var controller = (function (budgetctrl, UIctrl) {


    var ctrlAdd = function () {
        var input, budget, sum, exp;
        input = UIctrl.getinput();

        if (input.description != "" && !isNaN(input.value) && input.value > 0) {

            var Item = budgetctrl.additem(input.type, input.description, input.value);

            console.log(Item);
            UIctrl.inputDisplay(Item, input.type);
            UIctrl.clearfields();
            budget = budgetctrl.calcbudget();
            UIctrl.displayBud(budget);
        }


    }
    var deleteitem = function () {
        budgetctrl.delete();
    }

    var eventhandlers = function () {
        var DOM = UIctrl.getDom();

        document.querySelector(DOM.addbutton).addEventListener('click', ctrlAdd);

        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13) {
                ctrlAdd();
            }
            document.querySelector(DOM.delete).addEventListener('click', deleteitem);

        });

    }

    return {
        init: function () {
            console.log("Application has started");
            eventhandlers();
        }
    }

})(budgetControl, UIcontrol);
controller.init();
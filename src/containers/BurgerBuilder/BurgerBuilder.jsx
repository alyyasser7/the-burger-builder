import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders'




const INGREDIENT_PRICES = {
    salad: 1.5,
    cheese: 3.99,
    bacon: 6.7,
    meat: 10
}

class BurgerBuilder extends Component {
    /* alternative*/ 
    /*constructor (props) {
        super(props)
        this.state = {...}
    }*/
    state = {
        ingredients: null,
        totalPrice: 10,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        axios.get('https://burger-builder-a505f-default-rtdb.firebaseio.com/ingredients.json')
        .then((response) => {
            this.setState({ingredients: response.data})
        })
        .catch(error => {
            this.setState({error: true})
        })
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey =>{
                return ingredients[igKey]
            })
            .reduce((sum, el) => {
                return sum + el;
            },0)
            this.setState({purchaseable: sum > 0})
    }

    addIngredientsHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount
        const priceAddition = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice + priceAddition
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchaseState(updatedIngredients)
    }

    removeIngredientsHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        if (oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount
        const priceDeduction = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice - priceDeduction
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchaseState(updatedIngredients)
    }

    purchaseHandler = () => {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }
    
    purchaseContinueHandler = () => {
        // alert('YOU CONTINUE')
        this.setState({loading: true})
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Aly Yasser',
                address: {
                    city: 'Houston',
                    state: 'Texas',
                    postalCode: '77063',
                    street: '50 Canyon'
                },
                deliveryMethod: 'Fast',
                email: 'aly@lyyasser.com',
            }
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false, purchasing: false})
            })
            .catch(error => {
                this.setState({loading: false, purchasing: false})
            })
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null
        let burger = this.state.error ? <p>Ingredients can't be loaded!! </p> : <Spinner />
        if ( this.state.ingredients)
        {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls 
                    ingredientAdded={this.addIngredientsHandler}
                    ingredientRemoved={this.removeIngredientsHandler} 
                    disabled={disabledInfo} 
                    purchaseable={this.state.purchaseable}
                    ordered={this.purchaseHandler}
                    price={this.state.totalPrice} />
                </Aux>
            )
            orderSummary = <OrderSummary
                ingredients= {this.state.ingredients}
                price= {this.state.totalPrice}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />
        }
        if (this.state.loading){
            orderSummary = <Spinner />
        }

        return ( 
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder,axios);
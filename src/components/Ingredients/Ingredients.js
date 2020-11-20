import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   fetch('https://react-hooks-e8622.firebaseio.com/ingredients.json')
  //     .then(response => response.json())
  //     .then(responseData => {
  //       const loadedIngredients = [];
  //       for (const key in responseData) {
  //         loadedIngredients.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount
  //         });
  //       }
  //       setUserIngredients(loadedIngredients);
  //     });
  // }, []);

  useEffect(() => {
    console.log('RENDERING INGREDEINT', userIngredients)
  }, [userIngredients])

  const filteredIngredientsHandler = useCallback(filterIngredients => {
    setUserIngredients(filterIngredients);
  }, [])


  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-e8622.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE'
      }
    ).then(response => {
      setIsLoading(false);
      setUserIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      );
    }).catch(error => {
      // setError('Something went wrong!');
      setIsLoading(false);
    });
  };

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-e8622.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      setIsLoading(false);
      return response.json()
    }).then(responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient }
      ])
    })
  }
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;

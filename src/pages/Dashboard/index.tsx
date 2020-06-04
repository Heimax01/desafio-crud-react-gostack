import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      // TO-DO LOAD FOODS
      const { data } = await api.get('foods');

      // console.log(response.data);
      setFoods(data);
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // TO-DO ADD A NEW FOOD PLATE TO THE API
      const maxId = foods.reduce((actualValue, actualFood) => {
        if (actualValue < actualFood.id) {
          return actualFood.id;
        }
        return actualValue;
      }, 0);

      const newFood = {
        id: maxId + 1,
        name: food.name,
        image: food.image,
        price: food.price,
        description: food.description,
        available: true,
      };
      await api.post('/foods', newFood);

      setFoods([...foods, newFood]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    // TO-DO DELETE A FOOD PLATE FROM THE API

    // console.log(editingFood);

    const indexFood = foods.findIndex(
      actualfood => actualfood.id === editingFood.id,
    );

    const updateFoodList = [...foods];

    const updatedFood: IFoodPlate = {
      id: editingFood.id,
      name: food.name,
      image: food.image,
      price: food.price,
      description: food.description,
      available: editingFood.available,
    };

    await api.put(`foods/${editingFood.id}`, updatedFood);

    updateFoodList[indexFood] = updatedFood;

    setFoods(updateFoodList);
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // TO-DO DELETE A FOOD PLATE FROM THE API
    const indexFood = foods.findIndex(food => food.id === id);

    if (indexFood >= 0) {
      const newFoodsList = [...foods];

      await api.delete(`/foods/${id}`);

      newFoodsList.splice(indexFood, 1);
      setFoods(newFoodsList);
    }
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    // TO-DO SET THE CURRENT EDITING FOOD ID IN THE STATE
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;

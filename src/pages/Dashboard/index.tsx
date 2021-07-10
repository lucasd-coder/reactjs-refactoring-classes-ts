import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface Foods {
  id: string;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

function Dashboard() {
  const [ foods, setFoods] = useState<Foods[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Foods>({} as Foods);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => { 
      api.get('/foods')
      .then(response => setFoods(response.data) );
  }, []);

  const handleAddFood = async (food: Foods) => {
      try {
        const response = await api.post('/foods', {
          ...food,
          available: true
         });

         setFoods(oldState => [...oldState, response.data]);

      } catch (err) {
        console.log(err);
        
      }
  }

  const handleUpdateFood = async (food: Foods) => {
    try {
      
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, 
      { ...editingFood,...food });

      const foodsUpdated = foods.map(f => 
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      ); 

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
      
    }
  }

  const handleDeleteFood = async (id: string) => {

    await api.delete(`/foods/${id}`);

    setFoods(oldState => oldState.filter((food) => food.id !== id));
  }
  
  const toggleModal = () => {
    setModalOpen(oldState => !oldState);
  }

  const toggleEditModal = () => {
    setEditModalOpen(oldState => !oldState);    
  }

  const handleEditFood = (food: Foods) => {
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

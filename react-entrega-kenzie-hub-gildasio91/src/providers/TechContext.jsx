import { createContext, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserContext";
import { api } from "../services/api";
import { toast } from "react-toastify";

export const TechContext = createContext({});

export const TechProvider = ({ children }) => {
  const { user, userId, token } = useContext(UserContext);
  const [techList, setTechList] = useState([]);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [editingTech, setEditingTech] = useState(null);

  const modalRef = useRef(null);
  const modalEditRef = useRef(null);
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const getTechs = async () => {
      try {
        const { data } = await api.get(`/users/${userId}`, authHeader);

        setTechList(data.techs);
      } catch (error) {
        console.log(error);
      }
    };
    getTechs();
  }, []);

  const createTech = async (formData) => {
    try {
      const { data } = await api.post("/users/techs", formData, authHeader);
      setTechList([...techList, data]);
      toast.success("Tecnologia adicionada");
      setIsOpenCreate(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTech = async (formData) => {
    try {
      await api.delete(`/users/techs/${formData.id}`, authHeader);
      const newTechs = techList.filter(({ id }) => id !== formData.id);
      setTechList(newTechs);
      toast.success("Tecnologia excluida");
    } catch (error) {
      console.log(error);
    }
  };

  const updateTech = async (formData) => {
    try {
      const { data } = await api.put(
        `/users/techs/${editingTech.id}`,
        formData,
        authHeader
      );

      const updateTechs = techList.map((el) => {
        if (el.id === data.id) {
          return data;
        }
        return el;
      });
      setTechList(updateTechs);
      toast.success("Tecnologia atualizada");
      setEditingTech(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TechContext.Provider
      value={{
        modalEditRef,
        modalRef,
        techList,
        setIsOpenCreate,
        isOpenCreate,
        createTech,
        deleteTech,
        updateTech,
        editingTech,
        setEditingTech,
      }}
    >
      {children}
    </TechContext.Provider>
  );
};

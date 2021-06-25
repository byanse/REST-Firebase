import { createStore } from 'vuex'
import router from '../router'

export default createStore({
  state: {
    tareas: [],
    tarea: { id: '', nombre: '', categoria: [], estado: '', numero: 0}
  },
  mutations: {
    cargar(state, payload) {
      state.tareas = payload
    },
    set(state, payload) {
      console.log(payload)
      state.tareas.push(payload)
      
    },
    delete(state, payload) {
      state.tareas = state.tareas.filter(item => item.id !== payload)
      
    },
    tarea(state, payload) {
      if (!state.tareas.find(item => item.id === payload)){
        console.log('entro aquí')
        router.push('/')
        return 
      }
      state.tarea = state.tareas.find(item => item.id === payload)
      
    },
    update(state, payload) {
      state.tareas = state.tareas.map(item => item.id === payload.id ? payload : item)
      
    }
  },
  actions: {
    //leer la base de datos
    async cargarLocalStorage({ commit }) {
      try {
        const res = await fetch('https://udemy-api-ba4f1-default-rtdb.firebaseio.com/tareas/.json')
        const dataDB = await res.json()
        const arrayTareas = []

        for (let id in dataDB) {
          console.log(id)
          console.log(dataDB[id])
          arrayTareas.push(dataDB[id])
        }

        commit ('cargar', arrayTareas)

      } catch (error) {
        console.log(error)
        
      }
      
    },
    async setTareas({ commit }, tarea) {
      try {
        const res = await fetch(`https://udemy-api-ba4f1-default-rtdb.firebaseio.com/tareas/${tarea.id}.json`,{
          method: 'PUT',
          headers:{'Content-Type': 'application/json'},
          body: JSON.stringify(tarea)
        })

        const dataDB = await res.json()
        console.log(dataDB)

      } catch (error) {
        console.log(error)
      }
      commit('set', tarea)
    },
    async deleteTarea({commit}, id){
      try {
          await fetch(`https://udemy-api-ba4f1-default-rtdb.firebaseio.com/tareas/${id}.json`,{
          method: 'DELETE'
        })
        commit('delete', id)
      } catch (error) {
        console.log(error)
      }
    },
    setTarea({commit}, id){
      commit ('tarea', id )
    },
    async updateTarea({ commit }, tarea) {
      try { 
        const res = await fetch(`https://udemy-api-ba4f1-default-rtdb.firebaseio.com/tareas/${tarea.id}.json`, {
          method: 'PATCH',
          body: JSON.stringify(tarea)
        })
        const dataDB = await res.json()
        commit('update', dataDB)

      } catch (error) {
        console.log(error)
      }
    }
  },
  modules: {
  }
})

/* el state es nuestro array, el payload sera nuestra tarea*/
/* cuando llamemos a la accion setTareas, tenemos que empujar tarea a dentro del array por eso usamos el codigo escrito en esta linea 16 */
/* esta tarea va a venir de nuestro formulario */
/* las tareas se envian desde las vistas */
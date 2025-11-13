import axios from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

const URL_API = import.meta.env.VITE_API_URL

export const useUserStore = defineStore('user', () => {
    const isLoggedIn = ref(!!localStorage.getItem('token')) // Đặt true nếu có token
    const isUserLoading = ref(false)
    const user = reactive({
        id: null,
        fullname: '',
        email: '',
        phone_number: '',
        address: '',
        cart_id: null,
        role_id: null
    })

    const cart_items = ref([])

    const setUser = (id, fullname) => {
        isLoggedIn.value = true
        user.id = id
        user.fullname = fullname
    }

    const logout = () => {
        const token = localStorage.getItem('token')
        if (!token) return

        axios.post(`${URL_API}/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .finally(() => {
                localStorage.removeItem('token')
                isLoggedIn.value = false
                user.id = null
                user.fullname = ''
                user.email = ''
                user.phone_number = ''
                user.address = ''
                user.cart_id = null
                user.role_id = null
                cart_items.value = []
            })
    }

    //Bein: fetch cart items
    const fetchCartItems = (cartId, token) => {
        axios.get(`${URL_API}/cartItems/${cartId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                if (response && response.data) {
                    cart_items.value = response.data.cart_items || []
                } else {
                    cart_items.value = []
                }
            })
            .catch((error) => {
                cart_items.value = []
                console.log(error)
                logout()
            })
    }
    //End: fetch cart items

    //Begin: fetch user profile
    const fetchProfile = () => {
        const token = localStorage.getItem('token')
        if (!token) {
            isLoggedIn.value = false
            return
        }
        isUserLoading.value = true
        axios.get(`${URL_API}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                if (response.data) {
                    const id = response.data.user.id || ''
                    const fullname = response.data.user.fullname || ''
                    setUser(id, fullname)
                    user.email = response.data.user.email || ''
                    user.phone_number = response.data.user.phone_number || ''
                    user.address = response.data.user.address || ''
                    user.role_id = response.data.user.role_id || null
                    user.cart_id = response.data.cart_id || null
                }
                if (user.cart_id) {
                    fetchCartItems(user.cart_id, token)
                } else {
                    cart_items.value = []
                }
            })
            .catch((error) => {
                console.log(error)
                logout()
            })
            .finally(() => {
                isUserLoading.value = false
            })
    }
    //End: fetch user profile

    return { isLoggedIn, user, setUser, logout, fetchProfile, cart_items, isUserLoading }
})
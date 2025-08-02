import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Tables = Database['public']['Tables']

// Products hook
export function useProducts() {
  const [products, setProducts] = useState<Tables['products']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, error, refetch: fetchProducts }
}

// Available slots hook
export function useAvailableSlots() {
  const [slots, setSlots] = useState<Tables['available_slots']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSlots()
  }, [])

  const fetchSlots = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('available_slots')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (error) throw error
      setSlots(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addSlot = async (slot: Tables['available_slots']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('available_slots')
        .insert(slot)
        .select()
        .single()

      if (error) throw error
      setSlots(prev => [...prev, data])
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const updateSlot = async (id: string, updates: Tables['available_slots']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('available_slots')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setSlots(prev => prev.map(slot => slot.id === id ? data : slot))
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const deleteSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('available_slots')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSlots(prev => prev.filter(slot => slot.id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  return { 
    slots, 
    loading, 
    error, 
    refetch: fetchSlots,
    addSlot,
    updateSlot,
    deleteSlot
  }
}

// Reservations hook
export function useReservations() {
  const [reservations, setReservations] = useState<Tables['reservations']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReservations(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addReservation = async (reservation: Tables['reservations']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert(reservation)
        .select()
        .single()

      if (error) throw error
      setReservations(prev => [data, ...prev])
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const updateReservation = async (id: string, updates: Tables['reservations']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setReservations(prev => prev.map(res => res.id === id ? data : res))
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  return { 
    reservations, 
    loading, 
    error, 
    refetch: fetchReservations,
    addReservation,
    updateReservation
  }
}

// User profile hook
export function useProfile() {
  const [profile, setProfile] = useState<Tables['profiles']['Row'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setProfile(null)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Tables['profiles']['Update']) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updates })
        .select()
        .single()

      if (error) throw error
      setProfile(data)
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  return { 
    profile, 
    loading, 
    error, 
    refetch: fetchProfile,
    updateProfile
  }
}

// Cart hook
export function useCart() {
  const [cartItems, setCartItems] = useState<(Tables['cart_items']['Row'] & { product: Tables['products']['Row'] })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setCartItems([])
        return
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)

      if (error) throw error
      setCartItems(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('cart_items')
        .upsert({ 
          user_id: user.id, 
          product_id: productId, 
          quantity 
        })
        .select(`
          *,
          product:products(*)
        `)
        .single()

      if (error) throw error
      
      setCartItems(prev => {
        const existing = prev.find(item => item.product_id === productId)
        if (existing) {
          return prev.map(item => item.product_id === productId ? data : item)
        }
        return [...prev, data]
      })
      
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const removeFromCart = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (error) throw error
      setCartItems(prev => prev.filter(item => item.product_id !== productId))
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .select(`
          *,
          product:products(*)
        `)
        .single()

      if (error) throw error
      setCartItems(prev => prev.map(item => item.product_id === productId ? data : item))
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const clearCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error
      setCartItems([])
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return { 
    cartItems, 
    loading, 
    error, 
    total,
    itemCount,
    refetch: fetchCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
}

// Favorites hook
export function useFavorites() {
  const [favorites, setFavorites] = useState<(Tables['favorites']['Row'] & { product: Tables['products']['Row'] })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setFavorites([])
        return
      }

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)

      if (error) throw error
      setFavorites(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, product_id: productId })
        .select(`
          *,
          product:products(*)
        `)
        .single()

      if (error) throw error
      setFavorites(prev => [...prev, data])
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const removeFromFavorites = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (error) throw error
      setFavorites(prev => prev.filter(fav => fav.product_id !== productId))
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' }
    }
  }

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.product_id === productId)
  }

  return { 
    favorites, 
    loading, 
    error, 
    refetch: fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  }
}
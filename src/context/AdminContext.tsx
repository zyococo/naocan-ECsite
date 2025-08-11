import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'buddhist' | 'preserved';
  description: string;
  tags: string[];
  rating: number;
  reviews: number;
  color: string;
  size: string;
  flower: string;
  isNew: boolean;
  isSale: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  participants: number;
  flowerType: string;
  colorPreference: string;
  message: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface AvailableSlot {
  id: string;
  date: string;
  time: string;
  maxParticipants: number;
  currentReservations: number;
  isActive: boolean;
  createdAt: string;
}

interface AdminState {
  isAuthenticated: boolean;
  isLoading: boolean;
  products: Product[];
  reservations: Reservation[];
  availableSlots: AvailableSlot[];
}

type AdminAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS' }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_RESERVATIONS'; payload: Reservation[] }
  | { type: 'UPDATE_RESERVATION'; payload: Reservation }
  | { type: 'SET_AVAILABLE_SLOTS'; payload: AvailableSlot[] }
  | { type: 'ADD_AVAILABLE_SLOT'; payload: AvailableSlot }
  | { type: 'UPDATE_AVAILABLE_SLOT'; payload: AvailableSlot }
  | { type: 'DELETE_AVAILABLE_SLOT'; payload: string };

const initialState: AdminState = {
  isAuthenticated: false,
  isLoading: false,
  products: [],
  reservations: [],
  availableSlots: []
};

const adminReducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };

    case 'LOGIN_SUCCESS':
      return { ...state, isAuthenticated: true, isLoading: false };

    case 'LOGIN_FAILURE':
      return { ...state, isAuthenticated: false, isLoading: false };

    case 'LOGOUT':
      return { ...initialState };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };

    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };

    case 'SET_RESERVATIONS':
      return { ...state, reservations: action.payload };

    case 'UPDATE_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.map(reservation =>
          reservation.id === action.payload.id ? action.payload : reservation
        )
      };

    case 'SET_AVAILABLE_SLOTS':
      return { ...state, availableSlots: action.payload };

    case 'ADD_AVAILABLE_SLOT':
      return { ...state, availableSlots: [...state.availableSlots, action.payload] };

    case 'UPDATE_AVAILABLE_SLOT':
      return {
        ...state,
        availableSlots: state.availableSlots.map(slot =>
          slot.id === action.payload.id ? action.payload : slot
        )
      };

    case 'DELETE_AVAILABLE_SLOT':
      return {
        ...state,
        availableSlots: state.availableSlots.filter(slot => slot.id !== action.payload)
      };

    default:
      return state;
  }
};

interface AdminContextType {
  state: AdminState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loadData: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateReservationStatus: (id: string, status: Reservation['status']) => Promise<boolean>;
  addAvailableSlot: (slot: Omit<AvailableSlot, 'id' | 'createdAt'>) => Promise<boolean>;
  updateAvailableSlot: (slot: AvailableSlot) => Promise<boolean>;
  deleteAvailableSlot: (id: string) => Promise<boolean>;
  toggleSlotStatus: (id: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // ローカルストレージから管理者認証状態を確認
        const adminAuth = localStorage.getItem('adminAuth');
        if (adminAuth === 'true') {
          dispatch({ type: 'LOGIN_SUCCESS' });
          loadData();
          return;
        }

        // Supabaseが利用可能な場合のみ実行
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Check if user is admin
            const { data: profile } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', session.user.id)
              .single();
            
            if (profile?.name === 'admin') {
              dispatch({ type: 'LOGIN_SUCCESS' });
              loadData();
            }
          }
        }
      } catch (error) {
        console.warn('Admin session check failed:', error);
      }
    };

    checkSession();

    // Supabaseが利用可能な場合のみリスナーを設定
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          dispatch({ type: 'LOGOUT' });
          localStorage.removeItem('adminAuth');
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Check if user is admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', session.user.id)
            .single();
          
          if (profile?.name === 'admin') {
            dispatch({ type: 'LOGIN_SUCCESS' });
            loadData();
          } else {
            dispatch({ type: 'LOGIN_FAILURE' });
          }
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Supabaseが利用可能で.envファイルが存在する場合は実際のデータを使用
      if (supabase && import.meta.env.VITE_SUPABASE_URL) {
        // Load products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        const products: Product[] = (productsData || []).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.original_price || undefined,
          image: p.image_url,
          category: p.category,
          description: p.description,
          tags: p.tags || [],
          rating: Number(p.rating),
          reviews: p.reviews,
          color: p.color || '',
          size: p.size,
          flower: p.flower || '',
          isNew: p.is_new,
          isSale: p.is_sale,
          createdAt: p.created_at,
          updatedAt: p.updated_at
        }));

        dispatch({ type: 'SET_PRODUCTS', payload: products });

        // Load reservations
        const { data: reservationsData, error: reservationsError } = await supabase
          .from('reservations')
          .select(`
            *,
            available_slots(date, time)
          `)
          .order('created_at', { ascending: false });

        if (reservationsError) throw reservationsError;

        const reservations: Reservation[] = (reservationsData || []).map(r => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          preferredDate: r.available_slots?.date || '',
          preferredTime: r.available_slots?.time || '',
          participants: r.participants,
          flowerType: r.flower_type || '',
          colorPreference: r.color_preference || '',
          message: r.message || '',
          status: r.status,
          createdAt: r.created_at,
          updatedAt: r.updated_at
        }));

        dispatch({ type: 'SET_RESERVATIONS', payload: reservations });

        // Load available slots
        const { data: slotsData, error: slotsError } = await supabase
          .from('available_slots')
          .select('*')
          .order('date', { ascending: true });

        if (slotsError) throw slotsError;

        const availableSlots: AvailableSlot[] = (slotsData || []).map(s => ({
          id: s.id,
          date: s.date,
          time: s.time,
          maxParticipants: s.max_participants,
          currentReservations: s.current_reservations,
          isActive: s.is_active,
          createdAt: s.created_at
        }));

        dispatch({ type: 'SET_AVAILABLE_SLOTS', payload: availableSlots });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Supabaseが利用できない場合はダミーデータを使用
      console.warn('Supabase not available, using dummy data');
      const dummyProducts: Product[] = [
        {
          id: '1',
          name: 'プリザーブド仏花 桜',
          price: 4800,
          originalPrice: 5200,
          image: '/naocan-logo.jpeg',
          category: 'buddhist',
          description: '美しい桜のプリザーブド仏花です。',
          tags: ['人気', '桜', '春'],
          rating: 4.5,
          reviews: 12,
          color: 'ピンク',
          size: '中',
          flower: '桜',
          isNew: true,
          isSale: true,
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01'
        }
      ];

      const dummyReservations: Reservation[] = [
        {
          id: '1',
          name: '山田太郎',
          email: 'yamada@example.com',
          phone: '090-1234-5678',
          preferredDate: '2025-01-15',
          preferredTime: '10:00-12:00',
          participants: 2,
          flowerType: '桜',
          colorPreference: 'ピンク',
          message: '初回利用です。よろしくお願いします。',
          status: 'pending',
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01'
        }
      ];

      const dummySlots: AvailableSlot[] = [
        {
          id: '1',
          date: '2025-01-15',
          time: '10:00-12:00',
          maxParticipants: 4,
          currentReservations: 2,
          isActive: true,
          createdAt: '2025-01-01'
        }
      ];

      dispatch({ type: 'SET_PRODUCTS', payload: dummyProducts });
      dispatch({ type: 'SET_RESERVATIONS', payload: dummyReservations });
      dispatch({ type: 'SET_AVAILABLE_SLOTS', payload: dummySlots });
    } catch (error) {
      console.warn('Error loading data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: 'LOGIN_START' });

      // Supabase認証のみを使用
      if (supabase && import.meta.env.VITE_SUPABASE_URL) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          console.error('Supabase login failed:', error);
          dispatch({ type: 'LOGIN_FAILURE' });
          return false;
        }

        // 認証が成功したユーザーを管理者として扱う
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          dispatch({ type: 'LOGIN_SUCCESS' });
          loadData();
          return true;
        }
      }

      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const logout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem('adminAuth');
      dispatch({ type: 'LOGOUT' });
      // 管理者ログイン画面にリダイレクト
      window.location.href = '/admin/login';
    } catch (error) {
      console.warn('Logout error:', error);
      localStorage.removeItem('adminAuth');
      dispatch({ type: 'LOGOUT' });
      // エラーが発生しても管理者ログイン画面にリダイレクト
      window.location.href = '/admin/login';
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          price: productData.price,
          original_price: productData.originalPrice,
          image_url: productData.image,
          category: productData.category,
          description: productData.description,
          tags: productData.tags,
          rating: productData.rating,
          reviews: productData.reviews,
          color: productData.color,
          size: productData.size,
          flower: productData.flower,
          is_new: productData.isNew,
          is_sale: productData.isSale
        })
        .select()
        .single();

      if (error) throw error;

      const newProduct: Product = {
        id: data.id,
        name: data.name,
        price: data.price,
        originalPrice: data.original_price || undefined,
        image: data.image_url,
        category: data.category,
        description: data.description,
        tags: data.tags || [],
        rating: Number(data.rating),
        reviews: data.reviews,
        color: data.color || '',
        size: data.size,
        flower: data.flower || '',
        isNew: data.is_new,
        isSale: data.is_sale,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      return false;
    }
  };

  const updateProduct = async (product: Product): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: product.name,
          price: product.price,
          original_price: product.originalPrice,
          image_url: product.image,
          category: product.category,
          description: product.description,
          tags: product.tags,
          rating: product.rating,
          reviews: product.reviews,
          color: product.color,
          size: product.size,
          flower: product.flower,
          is_new: product.isNew,
          is_sale: product.isSale
        })
        .eq('id', product.id)
        .select()
        .single();

      if (error) throw error;

      const updatedProduct: Product = {
        id: data.id,
        name: data.name,
        price: data.price,
        originalPrice: data.original_price || undefined,
        image: data.image_url,
        category: data.category,
        description: data.description,
        tags: data.tags || [],
        rating: Number(data.rating),
        reviews: data.reviews,
        color: data.color || '',
        size: data.size,
        flower: data.flower || '',
        isNew: data.is_new,
        isSale: data.is_sale,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      dispatch({ type: 'DELETE_PRODUCT', payload: id });
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  };

  const updateReservationStatus = async (id: string, status: Reservation['status']): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)
        .select(`
          *,
          available_slots(date, time)
        `)
        .single();

      if (error) throw error;

      const updatedReservation: Reservation = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferredDate: data.available_slots?.date || '',
        preferredTime: data.available_slots?.time || '',
        participants: data.participants,
        flowerType: data.flower_type || '',
        colorPreference: data.color_preference || '',
        message: data.message || '',
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      dispatch({ type: 'UPDATE_RESERVATION', payload: updatedReservation });
      return true;
    } catch (error) {
      console.error('Error updating reservation:', error);
      return false;
    }
  };

  const addAvailableSlot = async (slotData: Omit<AvailableSlot, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('available_slots')
        .insert({
          date: slotData.date,
          time: slotData.time,
          max_participants: slotData.maxParticipants,
          current_reservations: slotData.currentReservations,
          is_active: slotData.isActive
        })
        .select()
        .single();

      if (error) throw error;

      const newSlot: AvailableSlot = {
        id: data.id,
        date: data.date,
        time: data.time,
        maxParticipants: data.max_participants,
        currentReservations: data.current_reservations,
        isActive: data.is_active,
        createdAt: data.created_at
      };

      dispatch({ type: 'ADD_AVAILABLE_SLOT', payload: newSlot });
      return true;
    } catch (error) {
      console.error('Error adding slot:', error);
      return false;
    }
  };

  const updateAvailableSlot = async (slot: AvailableSlot): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('available_slots')
        .update({
          date: slot.date,
          time: slot.time,
          max_participants: slot.maxParticipants,
          current_reservations: slot.currentReservations,
          is_active: slot.isActive
        })
        .eq('id', slot.id)
        .select()
        .single();

      if (error) throw error;

      const updatedSlot: AvailableSlot = {
        id: data.id,
        date: data.date,
        time: data.time,
        maxParticipants: data.max_participants,
        currentReservations: data.current_reservations,
        isActive: data.is_active,
        createdAt: data.created_at
      };

      dispatch({ type: 'UPDATE_AVAILABLE_SLOT', payload: updatedSlot });
      return true;
    } catch (error) {
      console.error('Error updating slot:', error);
      return false;
    }
  };

  const deleteAvailableSlot = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('available_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;

      dispatch({ type: 'DELETE_AVAILABLE_SLOT', payload: id });
      return true;
    } catch (error) {
      console.error('Error deleting slot:', error);
      return false;
    }
  };

  const toggleSlotStatus = async (id: string): Promise<boolean> => {
    try {
      const slot = state.availableSlots.find(s => s.id === id);
      if (slot) {
        const updatedSlot = { ...slot, isActive: !slot.isActive };
        return await updateAvailableSlot(updatedSlot);
      }
      return false;
    } catch (error) {
      console.error('Error toggling slot status:', error);
      return false;
    }
  };

  return (
    <AdminContext.Provider value={{
      state,
      login,
      logout,
      loadData,
      addProduct,
      updateProduct,
      deleteProduct,
      updateReservationStatus,
      addAvailableSlot,
      updateAvailableSlot,
      deleteAvailableSlot,
      toggleSlotStatus
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
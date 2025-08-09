'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { rehydrate } from '@/store/slices/authSlice';

export default function AppInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rehydrate());
  }, [dispatch]);

  return null;
}

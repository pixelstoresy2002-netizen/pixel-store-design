'use client';

import React from 'react';
import { ContactPage } from '../../components/storefront/ContactPage';
import { StorefrontShell } from '../../components/storefront/StorefrontShell';
import { useStore } from '../../context/StoreContext';

export default function ContactRoutePage() {
  const { lang, settings } = useStore();

  return (
    <StorefrontShell currentView="contact" activeCategoryId="ALL">
      <ContactPage lang={lang} settings={settings} />
    </StorefrontShell>
  );
}

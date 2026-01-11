'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { dummyproducts } from '@/prisma/data/dummydata';
import { notFound } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from '@/app/context/cartcontext'; 

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const productId = parseInt(resolvedParams.id);

  const product = dummyproducts.find(p => p.id === productId);

  if (!product) {
    notFound();
  }

  const { addToShoppingCart } = useCart();

  const handleAddToCart = () => {
    addToShoppingCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
    });

    toast.success("Added to Cart 🛒", {
      description: product.name,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/shopping">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Shopping
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="relative h-96 md:h-full min-h-96">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded-2xl"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-200 rounded-2xl text-gray-500 text-xl">
                No Image Available
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {product.category && (
                <Badge variant="secondary" className="text-lg px-5 py-2 mb-6">
                  {product.category}
                </Badge>
              )}

              <p className="text-4xl font-bold text-primary mb-8">
                ₹{product.price}
              </p>

              <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full text-xl py-8 shadow-lg hover:shadow-xl transition-all gap-4"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-7 w-7" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
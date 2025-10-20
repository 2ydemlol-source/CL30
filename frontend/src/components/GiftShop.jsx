import React, { useState } from 'react';
import { X, Star, Gift } from 'lucide-react';
import { availableGifts } from '../mockData';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from '../hooks/use-toast';

const GiftShop = ({ isOpen, onClose, recipient, userStars, onSendGift, customGifts = [] }) => {
  const [selectedGift, setSelectedGift] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Combine standard and custom gifts
  const allGifts = [...availableGifts, ...customGifts];

  const handleGiftSelect = (gift) => {
    setSelectedGift(gift);
    setShowConfirm(true);
  };

  const handleConfirmPurchase = () => {
    if (userStars < selectedGift.price) {
      toast({
        title: 'Недостаточно звёзд',
        description: `Вам нужно ${selectedGift.price} звёзд, а у вас только ${userStars}`,
        variant: 'destructive'
      });
      return;
    }

    onSendGift(selectedGift);
    setShowConfirm(false);
    setSelectedGift(null);
    onClose();
    
    toast({
      title: 'Подарок отправлен! 🎁',
      description: `${selectedGift.nameRu} отправлен пользователю ${recipient.name}`
    });
  };

  return (
    <>
      <Dialog open={isOpen && !showConfirm} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Gift className="w-6 h-6 text-emerald-500" />
              Выберите подарок для {recipient?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-4 p-3 bg-zinc-800 rounded-lg">
              <span className="text-sm text-zinc-400">Ваш баланс:</span>
              <div className="flex items-center gap-1 text-lg font-semibold text-yellow-500">
                <Star className="w-5 h-5 fill-yellow-500" />
                {userStars}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {availableGifts.map((gift) => (
                <div
                  key={gift.id}
                  onClick={() => handleGiftSelect(gift)}
                  className={`relative p-4 rounded-xl cursor-pointer transition-all border-2 ${
                    userStars >= gift.price
                      ? 'bg-zinc-800 border-emerald-500 hover:bg-zinc-750 hover:scale-105'
                      : 'bg-zinc-900 border-zinc-700 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 mb-3 flex items-center justify-center">
                      <img
                        src={gift.image}
                        alt={gift.nameRu}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{gift.nameRu}</h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-yellow-500" />
                      <span className="font-bold">{gift.price}</span>
                    </div>
                  </div>
                  {userStars < gift.price && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                      <span className="text-red-400 font-semibold">Недостаточно звёзд</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={() => setShowConfirm(false)}>
        <DialogContent className="max-w-md bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl">Подтвердите покупку</DialogTitle>
          </DialogHeader>

          {selectedGift && (
            <div className="flex flex-col items-center py-4">
              <div className="w-32 h-32 mb-4">
                <img
                  src={selectedGift.image}
                  alt={selectedGift.nameRu}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{selectedGift.nameRu}</h3>
              <p className="text-zinc-400 mb-4 text-center">
                Вы хотите подарить <span className="text-white font-semibold">{selectedGift.nameRu}</span> пользователю{' '}
                <span className="text-emerald-500 font-semibold">{recipient?.name}</span>?
              </p>
              
              <div className="flex items-center gap-2 mb-6 text-lg">
                <span className="text-zinc-400">Стоимость:</span>
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                  <Star className="w-5 h-5 fill-yellow-500" />
                  {selectedGift.price}
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1 border-zinc-700 hover:bg-zinc-800"
                  onClick={() => setShowConfirm(false)}
                >
                  Отмена
                </Button>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleConfirmPurchase}
                >
                  Подтвердить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GiftShop;

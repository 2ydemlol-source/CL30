import React, { useMemo, useState } from 'react';
import { Star, Gift, ShieldCheck } from 'lucide-react';
import { availableGifts } from '../mockData';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from '../hooks/use-toast';
import LottieGift from './LottieGift';

const GiftShop = ({ isOpen, onClose, recipient, userStars, onSendGift, customGifts = [], isAdmin = false }) => {
  const [selectedGift, setSelectedGift] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const allGifts = useMemo(
    () => [...availableGifts, ...customGifts].filter((gift) => !gift.adminOnly || isAdmin),
    [customGifts, isAdmin]
  );

  const getLeft = (gift) => {
    if (!gift.totalSupply && gift.totalSupply !== 0) return null;
    return Math.max((gift.totalSupply || 0) - (gift.mintedCount || 0), 0);
  };

  const handleGiftSelect = (gift) => {
    const left = getLeft(gift);
    if (left === 0) {
      toast({ title: 'Подарок раскуплен', description: `${gift.name} больше недоступен`, variant: 'destructive' });
      return;
    }
    setSelectedGift(gift);
    setShowConfirm(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedGift) return;
    const left = getLeft(selectedGift);

    if (left === 0) {
      toast({ title: 'Подарок раскуплен', description: 'Выберите другой подарок', variant: 'destructive' });
      return;
    }

    if (userStars < selectedGift.price) {
      toast({
        title: 'Недостаточно звёзд',
        description: `Вам нужно ${selectedGift.price} звёзд, а у вас только ${userStars}`,
        variant: 'destructive'
      });
      return;
    }

    const sent = onSendGift(selectedGift);
    if (!sent) return;

    setShowConfirm(false);
    setSelectedGift(null);
    onClose();

    toast({
      title: 'Подарок отправлен! 🎁',
      description: `${selectedGift.name} отправлен пользователю ${recipient.name}`
    });
  };

  return (
    <>
      <Dialog open={isOpen && !showConfirm} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl bg-[#0f1728] border-[#23324d] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Gift className="w-6 h-6 text-[#2aabee]" />
              Send gift to {recipient?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-4 p-3 bg-[#131f36] rounded-xl border border-[#1e2d48]">
              <span className="text-sm text-[#9aabc8]">Ваш баланс:</span>
              <div className="flex items-center gap-1 text-lg font-semibold text-yellow-400">
                <Star className="w-5 h-5 fill-yellow-400" />
                {userStars}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
              {allGifts.map((gift) => {
                const left = getLeft(gift);
                const canBuy = userStars >= gift.price && left !== 0;
                return (
                  <button
                    key={gift.id}
                    onClick={() => handleGiftSelect(gift)}
                    className={`relative p-4 rounded-2xl text-left transition-all border ${canBuy
                      ? 'bg-[#13223c] border-[#2aabee] hover:scale-[1.02]'
                      : 'bg-[#131b2d] border-[#29364f] opacity-70 cursor-not-allowed'}`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-28 h-28 mb-2 rounded-2xl bg-[#0b1426] border border-[#23324d] p-2">
                        <LottieGift gift={gift} className="w-full h-full" />
                      </div>

                      <h3 className="text-sm font-semibold text-center">{gift.name}</h3>

                      <div className="mt-1 flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        <span className="font-bold text-sm">{gift.price}</span>
                      </div>

                      <p className="text-[11px] text-[#9aabc8] mt-1">
                        {left === null ? 'Unlimited' : `Left: ${left}`}
                      </p>

                      {gift.adminOnly && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#7dd3fc]">
                          <ShieldCheck className="w-3 h-3" /> Admin only
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirm} onOpenChange={() => setShowConfirm(false)}>
        <DialogContent className="max-w-md bg-[#101a2f] border-[#22314a] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Подтвердите отправку</DialogTitle>
          </DialogHeader>

          {selectedGift && (
            <div className="flex flex-col items-center py-4">
              <div className="w-32 h-32 mb-4 rounded-2xl bg-[#0b1426] border border-[#23324d] p-2">
                <LottieGift gift={selectedGift} className="w-full h-full" />
              </div>

              <h3 className="text-xl font-semibold mb-2">{selectedGift.name}</h3>
              <p className="text-[#9aabc8] mb-4 text-center">
                Отправить подарок <span className="text-white font-semibold">{selectedGift.name}</span> пользователю{' '}
                <span className="text-[#7dd3fc] font-semibold">{recipient?.name}</span>?
              </p>

              <div className="flex items-center gap-2 mb-2 text-lg">
                <span className="text-[#9aabc8]">Стоимость:</span>
                <div className="flex items-center gap-1 text-yellow-400 font-bold">
                  <Star className="w-5 h-5 fill-yellow-400" />
                  {selectedGift.price}
                </div>
              </div>

              <div className="text-xs text-[#9aabc8] mb-6">
                {getLeft(selectedGift) === null ? 'Unlimited supply' : `Осталось: ${getLeft(selectedGift)}`}
              </div>

              <div className="flex gap-3 w-full">
                <Button variant="outline" className="flex-1 border-[#334563] hover:bg-[#1a2740]" onClick={() => setShowConfirm(false)}>
                  Отмена
                </Button>
                <Button className="flex-1 bg-[#2aabee] hover:bg-[#1f96d8]" onClick={handleConfirmPurchase}>
                  Отправить
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

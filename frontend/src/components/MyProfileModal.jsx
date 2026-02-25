import React from 'react';
import { Gift, Star, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import LottieGift from './LottieGift';

const MyProfileModal = ({ isOpen, onClose, user, onGiftToSelf, onEditProfile }) => {
  const totalGifts = user.receivedGifts?.length || 0;
  const stars = user.stars || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#eaf4ff] border-[#cde6fb] text-[#102a43]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Профиль</DialogTitle>
            <Button variant="ghost" size="sm" className="bg-[#2aabee] hover:bg-[#1f96d8] text-white" onClick={onGiftToSelf}>
              <Gift className="w-4 h-4 mr-2" />
              Подарить себе
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[500px]">
          <div className="space-y-4 p-1">
            <div className="flex flex-col items-center py-4 bg-white rounded-2xl border border-[#d6eafc]">
              <Avatar className="w-28 h-28 mb-3 border-4 border-white shadow-lg">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
              {user.status && <p className="text-sm text-[#6783a2] mb-2">{user.status}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 flex flex-col items-center border border-[#d6eafc]">
                <Gift className="w-7 h-7 text-[#2aabee] mb-1" />
                <p className="text-2xl font-bold">{totalGifts}</p>
                <p className="text-xs text-[#6e87a3]">Получено</p>
              </div>
              <div className="bg-white rounded-xl p-4 flex flex-col items-center border border-[#d6eafc]">
                <Star className="w-7 h-7 text-yellow-500 fill-yellow-500 mb-1" />
                <p className="text-2xl font-bold">{stars}</p>
                <p className="text-xs text-[#6e87a3]">Звёзд</p>
              </div>
            </div>

            {user.receivedGifts && user.receivedGifts.length > 0 && (
              <div className="bg-white rounded-2xl p-3 border border-[#d6eafc]">
                <h3 className="text-sm font-semibold mb-3">Подарки</h3>
                <div className="space-y-2">
                  {user.receivedGifts.slice(-6).reverse().map((gift) => (
                    <div key={gift.id} className="flex items-center gap-3 bg-[#f4f9ff] rounded-xl p-2 border border-[#e2f0ff]">
                      <div className="w-12 h-12 rounded-xl bg-white border border-[#d8eefe] p-1">
                        <LottieGift gift={gift.gift} className="w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{gift.gift.name}</p>
                        <p className="text-xs text-[#6783a2] truncate">From: {gift.from.name}</p>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 text-xs">
                        <Star className="w-3 h-3 fill-yellow-500" />
                        {gift.gift.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button variant="outline" className="w-full border-[#b8d7f4] hover:bg-[#e5f2ff]" onClick={onEditProfile}>
              <Edit2 className="w-4 h-4 mr-2" />
              Редактировать профиль
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MyProfileModal;

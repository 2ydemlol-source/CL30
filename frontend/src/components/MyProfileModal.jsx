import React from 'react';
import { Gift, Star, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';

const MyProfileModal = ({ isOpen, onClose, user, onGiftToSelf, onEditProfile }) => {
  const totalGifts = user.receivedGifts?.length || 0;
  const stars = user.stars || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Мой профиль</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="bg-[#2fa34e] hover:bg-[#258a3c] text-white"
              onClick={onGiftToSelf}
            >
              <Gift className="w-4 h-4 mr-2" />
              Подарить подарок
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[500px]">
          <div className="space-y-4 p-2">
            {/* Avatar and Name */}
            <div className="flex flex-col items-center py-4">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
              {user.status && (
                <p className="text-sm text-zinc-400 mb-3">{user.status}</p>
              )}
            </div>

            {/* Usernames */}
            {user.usernames && user.usernames.length > 0 && (
              <div className="bg-zinc-800 rounded-lg p-3">
                <h3 className="text-sm font-semibold mb-2">Юзернеймы:</h3>
                <div className="flex flex-wrap gap-2">
                  {user.usernames.map((username, idx) => (
                    <span key={idx} className="text-sm text-[#2fa34e]">
                      @{username}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* About */}
            {user.about && (
              <div className="bg-zinc-800 rounded-lg p-3">
                <h3 className="text-sm font-semibold mb-2">Описание:</h3>
                <p className="text-sm text-zinc-300">{user.about}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800 rounded-lg p-4 flex flex-col items-center">
                <Gift className="w-8 h-8 text-[#2fa34e] mb-2" />
                <p className="text-2xl font-bold">{totalGifts}</p>
                <p className="text-xs text-zinc-400">Получено подарков</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-4 flex flex-col items-center">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500 mb-2" />
                <p className="text-2xl font-bold">{stars}</p>
                <p className="text-xs text-zinc-400">Звёзд</p>
              </div>
            </div>

            {/* Recent Gifts */}
            {user.receivedGifts && user.receivedGifts.length > 0 && (
              <div className="bg-zinc-800 rounded-lg p-3">
                <h3 className="text-sm font-semibold mb-3">Последние подарки:</h3>
                <div className="space-y-2">
                  {user.receivedGifts.slice(-5).reverse().map((gift) => (
                    <div key={gift.id} className="flex items-center gap-3 bg-zinc-900 rounded p-2">
                      <img
                        src={gift.gift.image}
                        alt={gift.gift.nameRu}
                        className="w-10 h-10 object-contain"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{gift.gift.nameRu}</p>
                        <p className="text-xs text-zinc-400 truncate">От: {gift.from.name}</p>
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

            {/* Edit Profile Button */}
            <Button
              variant="outline"
              className="w-full border-zinc-700 hover:bg-zinc-800"
              onClick={onEditProfile}
            >
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

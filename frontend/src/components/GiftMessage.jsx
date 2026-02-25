import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent } from './ui/dialog';
import LottieGift from './LottieGift';

const GiftMessage = ({ gift, sender, recipient, isReceived }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center my-4">
        <button
          onClick={() => setOpen(true)}
          className="relative w-80 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(42,171,238,0.35)] border border-[#bfe6ff] bg-gradient-to-br from-[#eaf7ff] to-white p-5 text-left"
        >
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 mb-3 rounded-2xl bg-[#dff3ff] border border-[#bde4ff] p-2">
              <LottieGift gift={gift} className="w-full h-full" />
            </div>

            <h3 className="text-xl font-bold text-[#10304f] mb-1">{gift.name}</h3>
            <p className="text-[#3d6387] text-sm mb-3">
              {isReceived ? 'You received a gift' : 'You sent a gift'}
            </p>

            <div className="flex items-center gap-2 mb-3 bg-white/80 rounded-full px-3 py-1 border border-[#d7ecff]">
              <Avatar className="w-7 h-7 border border-white">
                <AvatarImage src={isReceived ? sender.avatar : recipient.avatar} />
                <AvatarFallback>{(isReceived ? sender.name : recipient.name)?.[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold text-[#1c3e61]">{isReceived ? sender.name : recipient.name}</span>
            </div>

            <div className="flex items-center gap-1 text-[#355f88]">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="font-semibold">{gift.price}</span>
            </div>
          </div>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm bg-[#f2f8ff] border-[#cfe9ff]">
          <div className="flex flex-col items-center py-4">
            <div className="w-40 h-40 rounded-3xl bg-white border border-[#d2e9ff] p-3 mb-4">
              <LottieGift gift={gift} className="w-full h-full" />
            </div>
            <h4 className="text-2xl font-bold text-[#10304f] mb-1">{gift.name}</h4>
            <p className="text-sm text-[#4b6f93] mb-2">Gift details</p>
            <div className="text-[#365f86] flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> {gift.price}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GiftMessage;

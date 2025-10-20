import React from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const GiftMessage = ({ gift, sender, recipient, isReceived }) => {
  return (
    <div className="flex justify-center my-4">
      <div 
        className="relative w-80 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20"
        style={{
          background: 'linear-gradient(135deg, #00CFCF 0%, #FFFFFF 100%)'
        }}
      >
        <div className="p-6 flex flex-col items-center">
          {/* Gift Image */}
          <div className="w-32 h-32 mb-4">
            <img
              src={gift.image}
              alt={gift.nameRu}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          {/* Gift Name */}
          <h3 className="text-2xl font-bold text-zinc-900 mb-2">{gift.nameRu}</h3>

          {/* Message */}
          <p className="text-zinc-700 font-medium mb-3">
            {isReceived ? 'Вам подарили подарок' : 'Вы подарили подарок'}
          </p>

          {/* Recipient/Sender Info */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarImage src={isReceived ? sender.avatar : recipient.avatar} />
              <AvatarFallback>
                {isReceived ? sender.name[0] : recipient.name[0]}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-zinc-900">
              {isReceived ? sender.name : recipient.name}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-1 text-zinc-700">
            <span className="font-medium">
              {isReceived ? 'Ценность:' : 'Стоимость:'}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-600 text-yellow-600" />
              <span className="font-bold">{gift.price}</span>
              <span>звёзд</span>
            </div>
          </div>
        </div>

        {/* Decorative overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.3) 0%, transparent 70%)'
          }}
        />
      </div>
    </div>
  );
};

export default GiftMessage;

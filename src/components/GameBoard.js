import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Card from './Card';
import DropSlot from './DropSlot';
import './GameBoard.css';

const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
  return images;
};

const images = importAll(require.context('../assets/images', false, /\.(png|jpe?g|svg)$/));

// const initialCards = Array.from({ length: 15 }, (_, index) => ({
//   id: index + 1,
//   name: `card ${index + 1}`,
//   image: images[`card${index + 1}.jpg`],
//   count: 2, 
// }));

const initialCards = [
  { id: 1, name: 'spoon', image: images['card1.jpg'], count: 2 },
  { id: 2, name: 'rice', image: images['card2.jpg'], count: 2 },
  { id: 3, name: 'mushroom', image: images['card3.jpg'], count: 2 },
  { id: 4, name: 'potato', image: images['card4.jpg'], count: 2 },
  { id: 5, name: 'sesame', image: images['card5.jpg'], count: 2 },
  { id: 6, name: 'white', image: images['card6.jpg'], count: 2 },
  { id: 7, name: 'chicken', image: images['card7.jpg'], count: 2 },
  { id: 8, name: 'black', image: images['card8.jpg'], count: 2 },
  { id: 9, name: 'chili', image: images['card9.jpg'], count: 2 },
  { id: 10, name: 'yellow', image: images['card10.jpg'], count: 2 },
  { id: 11, name: 'bamboo', image: images['card11.jpg'], count: 2 },
  { id: 12, name: 'onion', image: images['card12.jpg'], count: 2 },
  { id: 13, name: 'green', image: images['card13.jpg'], count: 2 },
  { id: 14, name: 'dumpling', image: images['card14.jpg'], count: 2 },
  { id: 15, name: 'sea', image: images['card15.jpg'], count: 2 },
];


const GameBoard = () => {
  const [cards, setCards] = useState(initialCards);
  const [slots, setSlots] = useState(Array(30).fill(null));
  //const [highlightedSlots, setHighlightedSlots] = useState(new Set());
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [latestMatch, setLatestMatch] = useState([]);
  const [matchesToCover, setMatchesToCover] = useState([]);

 
  //This part doesn't have blue filter
  // const updateHighlightedSlots = (updatedSlots) => {
  //   const duplicates = {};
  //   updatedSlots.forEach((slot, index) => {
  //     if (slot) {
  //       if (duplicates[slot.id]) {
  //         duplicates[slot.id].push(index);
  //       } else {
  //         duplicates[slot.id] = [index];
  //       }
  //     }
  //   });

  //   const newMatchedPairs = Object.values(duplicates)
  //     .filter(indexes => indexes.length > 1)
  //     .flat();

  //   const updatedMatchedPairs = [...newMatchedPairs];
  //   const uniqueMatchedPairs = Array.from(new Set(updatedMatchedPairs));

  //   setMatchedPairs(uniqueMatchedPairs);

  //   if (newMatchedPairs.length > matchedPairs.length) {
  //     const newLatestMatch = newMatchedPairs.filter(x => !matchedPairs.includes(x));
  //     setLatestMatch(newLatestMatch);
  //   } else {
  //     setLatestMatch([]);
  //   }
  // };
  const updateHighlightedSlots = (updatedSlots) => {
    const duplicates = {};
    updatedSlots.forEach((slot, index) => {
      if (slot) {
        if (duplicates[slot.id]) {
          duplicates[slot.id].push(index);
        } else {
          duplicates[slot.id] = [index];
        }
      }
    });

    const newMatchedPairs = Object.values(duplicates)
      .filter(indexes => indexes.length > 1)
      .flat();

    const updatedMatchedPairs = [...newMatchedPairs];
    const uniqueMatchedPairs = Array.from(new Set(updatedMatchedPairs));

    setMatchedPairs(uniqueMatchedPairs);

    if (newMatchedPairs.length > matchedPairs.length) {
      const newLatestMatch = newMatchedPairs.filter(x => !matchedPairs.includes(x));
      setLatestMatch(newLatestMatch);

      // Add the new matches to the cover queue
      setTimeout(() => {
        setMatchesToCover(prev => [...prev, ...newLatestMatch]);
      }, 100); // 1 second delay
    } else {
      setLatestMatch([]);
    }
  };

  

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Browser does not support Speech Recognition');
      alert('Browser does not support Speech Recognition');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const command =
        event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log('Voice command received:', command);

      const card = cards.find((card) => card.name === command);
      if (card) {
        handleCardClick(card);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech Recognition Error', event.error);
      alert('Speech Recognition Error: ' + event.error);
    };

    recognition.onstart = () => {
      console.log('Speech recognition service has started');
    };

    recognition.onend = () => {
      console.log('Speech recognition service disconnected');
    };

    recognition.start();

    return () => recognition.stop();
  }, [cards, slots]);

  const handleDrop = (item, dropId) => {
    setSlots((prevSlots) => {
      if (!prevSlots[dropId]) {
        const updatedSlots = [...prevSlots];
        updatedSlots[dropId] = { ...item, count: undefined };

        setCards((prevCards) =>
          prevCards
            .map((card) =>
              card.id === item.id ? { ...card, count: card.count - 1 } : card
            )
            .filter((card) => card.count > 0)
        );

        updateHighlightedSlots(updatedSlots);

        return updatedSlots;
      }
      return prevSlots;
    });
  };

  

  const handleCardClick = (card) => {
    setSlots((prevSlots) => {
      const nextEmptyIndex = prevSlots.findIndex((slot) => slot === null);
      if (nextEmptyIndex !== -1) {
        const updatedSlots = [...prevSlots];
        updatedSlots[nextEmptyIndex] = { ...card, count: undefined };

        setCards((prevCards) =>
          prevCards
            .map((c) =>
              c.id === card.id ? { ...c, count: c.count - 1 } : c
            )
            .filter((c) => c.count > 0)
        );

        updateHighlightedSlots(updatedSlots);

        return updatedSlots;
      }
      return prevSlots;
    });
  };

  const handleSlotClick = (slotId) => {
    setSlots((prevSlots) => {
      const card = prevSlots[slotId];
      if (card) {
        const updatedSlots = [...prevSlots];
        updatedSlots[slotId] = null;

        setCards((prevCards) => {
          const cardIndex = prevCards.findIndex((c) => c.id === card.id);
          if (cardIndex !== -1) {
            const updatedCards = [...prevCards];
            updatedCards[cardIndex].count = Math.min(updatedCards[cardIndex].count + 1, 2);
            return updatedCards;
          } else {
            return [...prevCards, { ...card, count: 1 }];
          }
        });

        updateHighlightedSlots(updatedSlots);

        return updatedSlots;
      }
      return prevSlots;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <div className="card-container">
          {cards.map((card) => (
            <Card key={card.id} id={card.id} image={card.image} onClick={() => handleCardClick(card)} />
          ))}
        </div>
        <div className="slot-container">
         {slots.map((slot, index) => (
            <DropSlot
              key={index}
              id={index}
              onDrop={handleDrop}
              onClick={() => handleSlotClick(index)}
              newestMatch={latestMatch.includes(index)}
              olderMatch={matchedPairs.includes(index) && !latestMatch.includes(index)}
              cover={matchesToCover.includes(index)}
            >
              {slot && <img src={slot.image} alt={`Card ${slot.id}`} width="100" height="150" />}
            </DropSlot>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default GameBoard;

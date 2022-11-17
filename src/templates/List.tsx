import React, {FC, useState} from 'react';
import Item from "./Item";
import {useGlobalContext} from "../context";
import {INewsEntry} from "../interfaces";

const List: FC = () => {
    const {savedItems, setSavedItems} = useGlobalContext();
    const [selectedCard, setSelectedCard] = useState<INewsEntry>({} as INewsEntry);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: INewsEntry) => {
        setSelectedCard(card);
    };

    const handleDragLeave = () => {
        setSavedItems(savedItems.map(el => ({...el, currentSelection: false})));
    };

    const handleDragEnd = () => {
        setSavedItems(savedItems.map(el => ({...el, currentSelection: false})));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, current: INewsEntry) => {
        e.preventDefault();
        setSavedItems(savedItems.map(el => el.url === current.url ? {...el, currentSelection: true} : el));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, card: INewsEntry) => {
        e.preventDefault();
        const reSorted = savedItems.map(el => {
            if (el.url === card.url) {
                return {...el, currentSelection: false, order: selectedCard.order};
            } else if (el.url === selectedCard.url) {
                return {...el, currentSelection: false, order: card.order};
            }

            return el;
        });
        setSavedItems(reSorted);
        localStorage.setItem('savedItems', JSON.stringify(reSorted));
    };

    return (
        <div className="wrapper__list">
            {savedItems.sort((a, b) => a.order - b.order).map(el => {
                return (
                    <div onDragStart={e => handleDragStart(e, el)}
                         onDragLeave={e => handleDragLeave()}
                         onDragOver={e => handleDragOver(e, el)}
                         onDragEnd={e => handleDragEnd()}
                         onDrop={e => handleDrop(e, el)}
                         onMouseLeave={e => handleDragEnd()}
                         draggable={true}
                         key={el.url}
                         className={el.currentSelection ? 'wrapper__list-item current' : 'wrapper__list-item'}>
                        <Item {...el} />
                    </div>
                )
            })}
        </div>
    );
};

export default List;

import React, {FC} from 'react';
import {useGlobalContext} from "../context";
import {INewsEntry} from "../interfaces";

const Item: FC<INewsEntry> = (props) => {
    const {author, date, description, imageSource, title, url, comment} = props;
    const {handleEntryRemoving, handleCommentTyping} = useGlobalContext();

    return (
        <>
            <i onClick={e => handleEntryRemoving(url, e)}/>
            <span><small>{date}</small>
                {author?.trim() || 'Автор неизвестен'}</span>
            <a rel='noreferrer' href={url} target='_blank'><img src={imageSource} alt=''/></a>
            <h4>
                <a rel='noreferrer' href={url} target='_blank'>{title?.trim()}</a>
            </h4>

            <div dangerouslySetInnerHTML={{__html: description}}/>
            <textarea onChange={e => handleCommentTyping(e.target.value, url)} value={comment} placeholder='Комментарий...'/>
        </>
    );
};

export default Item;

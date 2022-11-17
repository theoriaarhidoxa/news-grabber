import React from 'react';
import {DatePicker} from "antd";
import moment from "moment";
import {useGlobalContext} from "../context";

const Form = () => {

    const {query, setQuery, date, handleDateChange, handleSearchRequest} = useGlobalContext();

    return (
        <form className="wrapper__form">
            <input className="" type="text" placeholder="Что искать?" value={query} onChange={e => setQuery(e.target.value)} />
            <DatePicker onChange={date => handleDateChange(date || moment())} placeholder={'С какой даты?'} disabledDate={(current) => {
                return moment() <= current;
            }} />
            <button onClick={handleSearchRequest} disabled={!query || !date} type="button" className='btn'>Найти</button>
        </form>
    );
};

export default Form;

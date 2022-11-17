import './App.scss';
import React, {FC} from "react";
import List from "./templates/List";
import {Modal} from "antd";
import Loader from "./helpers/Loader";
import {useGlobalContext} from "./context";
import {Alert} from "antd";
import Form from "./templates/Form";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

const App: FC = () => {
    const {alert, setAlert, foundItems, handleFoundItemsRetrieve, handleEntryAddition, query, date, loading, modalVisible, error, setModalVisible} = useGlobalContext();

    const handleSearchEnd = () => {
        setModalVisible(false);
        handleFoundItemsRetrieve([]);
        setAlert(false);
    };

    return (
        <div className="wrapper">
            <p>Знакомство с бесплатной версией <a href='https://newsapi.org/' target='_blank'
                                                  rel='noreferrer'>newsapi.org</a> &mdash; новостной поиск с сохранением
                заметок
                на&nbsp;дашборд для дальнейшего прочтения. Парой
                компонентов поделился Ant Design.</p>
            <p>Без особого смысла, just for fun, добавлен drag-n-drop.</p>

            <Form/>
            <List/>

            <Modal open={modalVisible} title={`Найдено: ${foundItems.length}`} onCancel={handleSearchEnd}
                   footer={null}>
                {!error && <div className='tooltip'>
                    <strong>Внимание!</strong>
                    <p>Ваш реальный запрос выглядит так:<br/><br/> https://newsapi.org/v2/everything?q=<b>{query}</b>&from=<b>{date}</b>&apiKey=...
                    </p>
                    <p>Данные, представленные ниже, ему не соответствуют, т.к. бесплатный тарифный план не позволяет
                        делать запросы в production mode.</p>
                    <p>Протестировать работоспособность приложения с получением ответа сервера, релевантного введённым
                        `query` и `date`, можно с помощью <a href='https://github.com/theoriaarhidoxa/news-grabber/blob/main/newsGrabber.zip' target='_blank' rel='noreferrer'>архива</a>, развёрнутого на
                        localhost:3000.</p>
                </div>}
                {alert && <Alert message="Заметка уже добавлена!" type="error"/>}
                <PerfectScrollbar>
                    <div className='wrapper__scroll'>
                        <ol>
                            {error ? <h4>{error}</h4> : loading ? <Loader/> : foundItems.length > 0 ?
                                foundItems.map(el => {
                                    return (
                                        <li onClick={() => handleEntryAddition(el.url)} key={el.url}>{el.title}</li>
                                    )
                                }) : !loading ? <h3>Заметок не найдено, либо они закончились.</h3> : ''
                            }
                        </ol>
                    </div>
                </PerfectScrollbar>
            </Modal>
        </div>
    );
};

export default App;

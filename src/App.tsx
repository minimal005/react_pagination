import React, { useState } from 'react';
import './App.css';
import { getNumbers } from './utils';
import { Pagination } from './components/Pagination';
import cn from 'classnames';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const items: string[] = getNumbers(1, 42).map(n => `Item ${n}`);

interface Props {
  currentPage: number;
  perPage: number;
}
const visibleItems = (props: Props) => {
  const { currentPage, perPage } = props;
  const start = currentPage * perPage - perPage;
  const end = currentPage * perPage;

  return items.slice(start, end);
};

export const App: React.FC = () => {
  const [total] = useState<string[]>(items);
  const [visiblePages, setVisiblePages] = useState<number>(9);
  const [perPage, setPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages: number[] = getNumbers(1, Math.ceil(total.length / perPage));
  const showPages = visibleItems({ currentPage, perPage });
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onNextPage = (sign: '+' | '-') => {
    if (sign === '+') {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container">
      <h1>Items with Pagination</h1>

      <p className="lead" data-cy="info">
        Page {currentPage} (items {(currentPage - 1) * perPage + 1} -{' '}
        {currentPage * perPage} of {items.length})
      </p>

      <div className="form-group row">
        <div className="col-3 col-sm-2 col-xl-1">
          <select
            data-cy="perPageSelector"
            id="perPageSelector"
            className="form-control"
            value={perPage}
            onChange={event => {
              setPerPage(+event.target.value);
              setCurrentPage(1);
              setVisiblePages(() =>
                Math.ceil(items.length / +event.target.value),
              );
            }}
          >
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>

        <label htmlFor="perPageSelector" className="col-form-label col">
          items per page
        </label>
      </div>

      {/* Move this markup to Pagination */}
      <ul className="pagination">
        <li className={cn('page-item', { disabled: currentPage === 1 })}>
          <a
            data-cy="prevLink"
            className="page-link"
            href="#prev"
            aria-disabled={currentPage === 1 ? 'true' : 'false'}
            onClick={() => {
              onNextPage('-');
            }}
          >
            «
          </a>
        </li>
        {totalPages.map(page => (
          <Pagination
            key={page}
            page={page}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        ))}

        <li
          className={cn('page-item', {
            disabled: currentPage === visiblePages,
          })}
        >
          <a
            data-cy="nextLink"
            className="page-link"
            href="#next"
            onClick={() => onNextPage('+')}
            aria-disabled={currentPage === visiblePages ? 'true' : 'false'}
          >
            »
          </a>
        </li>
      </ul>
      <ul>
        {showPages.map(item => {
          const key = item.split(' ').at(-1);

          return (
            <li key={key} data-cy="item">
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;

import React, { useEffect, useRef, useState } from 'react';

const paginateArray = (array, pageSize) => {
  return array.reduce((accu, curr, i) => {
    const idx = Math.floor(i / pageSize);
    let page = accu[idx] || (accu[idx] = []);
    page.push(curr);
    return accu;
  }, []);
};

const Pagination = ({
  children,
  intervalMs,
  pageSize,
  pageNr,
  onPageChange,
}) => {
  let intervalIdRef = useRef(null);
  const [childrenArray, setChildrenArray] = useState(
    React.Children.toArray(children)
  );
  useEffect(() => {
    setChildrenArray(React.Children.toArray(children));
  }, [children]);

  useEffect(() => {
    const pageCount = Math.ceil(childrenArray.length / pageSize);
    if (pageCount > 1) {
      if (!intervalIdRef.current) {
        onPageChange(0, pageCount);
      }
      intervalIdRef.current = setInterval(() => {
        onPageChange((pageNr + 1) % pageCount, pageCount);
      }, intervalMs);
    } else {
      onPageChange(0, 0);
    }
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [childrenArray, pageNr, pageSize]);

  return <>{paginateArray(childrenArray, pageSize)[pageNr]}</>;
};

export default Pagination;

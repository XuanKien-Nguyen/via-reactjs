import React, { useContext, useEffect } from 'react';

import { LayoutContext } from '../../../contexts';

export default function Index() {

  const { setHeaderComponent } = useContext(LayoutContext);

  useEffect(() => {
    setHeaderComponent(<b>Create new product</b>);
    return () => {
      setHeaderComponent(null);
    };
  }, []);
  
  return (
    <div>CreateProduct page</div>
  );
}

import React from 'react';
import {render} from 'react-dom';
import DepotImport from './depotImport/index.jsx';

render(<DepotImport id={window.config.id} />,document.getElementById('app'))

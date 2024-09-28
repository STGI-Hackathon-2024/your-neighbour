import { createContext } from 'react';

const PhotoContext = createContext([null, null]);
const DocumentContext = createContext([null, null]);

export {PhotoContext, DocumentContext}
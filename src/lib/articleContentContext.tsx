import { createContext, useContext } from "react";

export interface InitialArticleContent {
  slug: string;
  content: string;
}

export const ArticleContentContext = createContext<InitialArticleContent | null>(null);

export const useInitialArticleContent = () => useContext(ArticleContentContext);

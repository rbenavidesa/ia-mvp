import express from 'express';
import * as articlesController from '../controllers/articles.controllers.js';

const routerArticles = express.Router();

routerArticles.get('/', articlesController.getDailyArticle);

export default routerArticles;

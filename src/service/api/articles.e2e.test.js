"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const articles = require(`./articles`);
const DataService = require(`../data-service/articles`);
const CommentService = require(`../data-service/comment`);

const { HttpCode } = require(`../constants`);

const mockData = [
  {
    id: "rgJIL-",
    category: [
      "Музыка",
      "Программирование",
      "Разное",
      "Железо",
      "Без рамки",
      "Рисование",
    ],
    announce:
      "Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Из под его пера вышло 8 платиновых альбомов. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.",
    title: "Как начать программировать",
    fullText:
      "Программировать не настолько сложно, как об этом говорят. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Золотое сечение — соотношение двух величин, гармоническая пропорция. Только преобретя их, я чувствую себя чудочеловеком. Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Это один из лучших рок-музыкантов. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов. Он написал больше 30 хитов. Еду надо примимать как минимум три раза.",
    createdDate: "2021-01-14 03:01:02",
    comments: [
      {
        text: "Мне кажется или я уже читал это где-то?",
        id: "7klUAx",
      },
      {
        text:
          "Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.Плюсую, но слишком много буквы!",
        id: "U72Awr",
      },
      {
        text: "Это где ж такие красоты?Плюсую, но слишком много буквы!",
        id: "6szAco",
      },
      {
        text:
          "Совсем немного...Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.Это где ж такие красоты?",
        id: "75cBM0",
      },
      {
        text:
          "Планируете записать видосик на эту тему?Совсем немного...Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.",
        id: "fFUn7o",
      },
    ],
  },
  {
    id: "T7JUa0",
    category: [
      "Без рамки",
      "Музыка",
      "Еда",
      "Кино",
      "За жизнь",
      "Деревья",
      "Рисование",
      "Разное",
      "Программирование",
    ],
    announce:
      "Это один из лучших рок-музыкантов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.",
    title: "Что такое золотое сечение",
    fullText:
      "Он написал больше 30 хитов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Из под его пера вышло 8 платиновых альбомов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Как начать действовать? Для начала просто соберитесь. Только преобретя их, я чувствую себя чудочеловеком. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Еду надо примимать как минимум три раза. Собрать камни бесконечности легко, если вы прирожденный герой. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.",
    createdDate: "2020-12-08 13:20:01",
    comments: [
      {
        text: "Плюсую, но слишком много буквы!",
        id: "ZEzN6W",
      },
    ],
  },
  {
    id: "vhmaSi",
    category: ["Рисование", "Программирование", "Еда", "IT"],
    announce:
      "Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Ёлки — это не просто красивое дерево. Это прочная древесина. Золотое сечение — соотношение двух величин, гармоническая пропорция. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.",
    title: "С этими карандашами вы сможете нарисавать всё",
    fullText:
      "Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Как начать действовать? Для начала просто соберитесь. Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов. Еду надо примимать как минимум три раза. Программировать не настолько сложно, как об этом говорят. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов.",
    createdDate: "2020-11-19 02:00:57",
    comments: [
      {
        text: "Плюсую, но слишком много буквы!",
        id: "XVoiz4",
      },
      {
        text:
          "Мне кажется или я уже читал это где-то?Это где ж такие красоты?Планируете записать видосик на эту тему?",
        id: "dmi1Wa",
      },
      {
        text: "Совсем немного...",
        id: "jis8w-",
      },
      {
        text:
          "Согласен с автором!Планируете записать видосик на эту тему?Это где ж такие красоты?",
        id: "e0gUej",
      },
      {
        text:
          "Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.Согласен с автором!Плюсую, но слишком много буквы!",
        id: "gECBR1",
      },
      {
        text: "Хочу такую же футболку :-)",
        id: "CzyMsR",
      },
      {
        text: "Это где ж такие красоты?",
        id: "gGQHYY",
      },
      {
        text: "Согласен с автором!",
        id: "-3j1Wv",
      },
    ],
  },
  {
    id: "6pCRSS",
    category: [
      "Железо",
      "Музыка",
      "Еда",
      "Рисование",
      "Программирование",
      "Деревья",
    ],
    announce:
      "Он написал больше 30 хитов. Это один из лучших рок-музыкантов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Как начать действовать? Для начала просто соберитесь.",
    title: "Что такое золотое сечение",
    fullText:
      "Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Собрать камни бесконечности легко, если вы прирожденный герой. Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Из под его пера вышло 8 платиновых альбомов.",
    createdDate: "2020-12-23 04:49:10",
    comments: [],
  },
  {
    id: "IBA_YK",
    category: ["Кино", "Железо", "Еда", "Музыка", "Программирование"],
    announce:
      "Только преобретя их, я чувствую себя чудочеловеком. Как начать действовать? Для начала просто соберитесь. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Из под его пера вышло 8 платиновых альбомов.",
    title: "Рок — это протест",
    fullText:
      "Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина. Только преобретя их, я чувствую себя чудочеловеком. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Еду надо примимать как минимум три раза. Первая большая ёлка была установлена только в 1938 году. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Как начать действовать? Для начала просто соберитесь. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Простые ежедневные упражнения помогут достичь успеха.",
    createdDate: "2020-12-02 05:07:22",
    comments: [
      {
        text: "Хочу такую же футболку :-)Совсем немного...",
        id: "5cEwn2",
      },
    ],
  },
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, { logging: false });
  await initDB(mockDB, { categories: mockCategories, articles: mockArticles });
  app.use(express.json());
  articles(app, new DataService(mockDB), new CommentService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () =>
    expect(response.body.length).toBe(5));

  test(`First article's id equals "rgJIL-"`, () =>
    expect(response.body[0].id).toBe(`rgJIL-`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/rgJIL-`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`article's title is "Как начать программировать"`, () =>
    expect(response.body.title).toBe(
      `Как начать программировать`
    ));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    category: `Котики`,
    title: `Дам погладить котика`,
    createdDate: `2020-09-30 18:50:32`,
    announce: `Дам погладить котика.`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(6)));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    category: `Котики`,
    title: `Дам погладить котика`,
    createdDate: `2020-09-30 18:50:32`,
    announce: `Дам погладить котика.`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
  };
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = { ...newArticle };
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    category: `Котики`,
    title: `Дам погладить котика`,
    createdDate: `2020-09-30 18:50:32`,
    announce: `Дам погладить котика.`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).put(`/articles/rgJIL-`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () =>
    expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () =>
    request(app)
      .get(`/articles/rgJIL-`)
      .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`)));
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();

  const validArticle = {
    category: `Это`,
    title: `валидный`,
    createdDate: `2020-09-30 18:50:32`,
    announce: `Дам погладить котика.`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();

  const invalidArticle = {
    category: `Это`,
    title: `невалидный`,
    createdDate: `2020-09-30 18:50:32`,
    announce: `Дам погладить котика.`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/T7JUa0`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () =>
    expect(response.body.id).toBe(`T7JUa0`));

  test(`Article count is 4 now`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app).delete(`/articles/NOEXST`).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`,
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/vhmaSi/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

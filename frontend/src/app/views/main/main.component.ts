import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleService} from "../../shared/services/article.service";
import {ArticleCardType} from "../../../types/article-card.type";
import {Subscription} from "rxjs";
import {PopupComponent} from "../../shared/components/popup/popup.component";
import {PopupType} from "../../../types/popup.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  customOptions: OwlOptions = {
    slideBy: 2,
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  };

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  };

  banners = [
    {
      name: 'Предложение месяца',
      image: 'banner1.png'
    },
    {
      name: 'Акция',
      image: 'banner2.png'
    },
    {
      name: 'Новость дня',
      image: 'banner3.png'
    }
  ];

  services = [
    {
      name: 'Создание сайтов',
      image: 'service1.png',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 7500
    },
    {
      name: 'Продвижение',
      image: 'service2.png',
      text: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 3500
    },
    {
      name: 'Реклама',
      image: 'service3.png',
      text: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 1000
    },
    {
      name: 'Копирайтинг',
      image: 'service4.png',
      text: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 750
    }
  ];

  advantages = [
    {
      title: 'Мастерски вовлекаем аудиторию в процесс.',
      text: 'Мы увеличиваем процент вовлечённости за короткий промежуток времени.'
    },
    {
      title: 'Разрабатываем бомбическую визуальную концепцию.',
      text: 'Наши специалисты знают как создать уникальный образ вашего проекта.'
    },
    {
      title: 'Создаём мощные воронки с помощью текстов.',
      text: 'Наши копирайтеры создают не только вкусные текста, но и классные воронки.'
    },
    {
      title: 'Помогаем продавать больше.',
      text: 'Мы не только помогаем разработать стратегию по продажам, но также корректируем её под нужды заказчика.'
    }
  ];

  reviews = [
    {
      image: 'review1.png',
      name: 'Станислав',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      image: 'review2.png',
      name: 'Алёна',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      image: 'review3.png',
      name: 'Мария',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    }
  ];

  articles: ArticleCardType[] = [];

  @ViewChild(PopupComponent)
  private popupComponent!: PopupComponent;

  popupType: PopupType = PopupType.order;

  private subscription: Subscription | null = null;

  constructor(private articleService: ArticleService) {
  }

  ngOnInit(): void {
    this.subscription = this.articleService.getPopularArticles()
      .subscribe((data: ArticleCardType[]) => {
        this.articles = data;
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  openDialog() {
    this.popupComponent.open();
  }

}

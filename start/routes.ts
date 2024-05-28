/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import route from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AdminDashboardController = () => import('#controllers/admin/dashboard_controller')
const AvatarsController = () => import('#controllers/avatars_controller')
const ProfilesController = () => import('#controllers/profiles_controller')
const WatchlistsController = () => import('#controllers/watchlists_controller')
const HomeController = () => import('#controllers/home_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const WritersController = () => import('#controllers/writers_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const DirectorsController = () => import('#controllers/directors_controller')
const MoviesController = () => import('#controllers/movies_controller')
const RedisController = () => import('#controllers/redis_controller')

route.get('/', [HomeController, 'index']).as('home')

route.get('/avatars/:filename', [AvatarsController, 'show']).as('avatars.show')

route.get('/movies', [MoviesController, 'index']).as('movies.index')

route
  .get('/movies/:slug', [MoviesController, 'show'])
  .as('movies.show')
  .where('slug', route.matchers.slug())

route
  .group(() => {
    route.get('/watchlist', [WatchlistsController, 'index']).as('index')
    route.post('/watchlists/:movieId/toggle', [WatchlistsController, 'toggle']).as('toggle')
    route
      .post('/watchlists/:movieId/toggle-watched', [WatchlistsController, 'toggleWatched'])
      .as('toggle.watched')
  })
  .as('watchlists')
  .use(middleware.auth())

route.get('/directors', [DirectorsController, 'index']).as('directors.index')
route.get('/directors/:id', [DirectorsController, 'show']).as('directors.show')

route.get('/writers', [WritersController, 'index']).as('writers.index')
route.get('/writers/:id', [WritersController, 'show']).as('writers.show')

route.delete('/redis/flush', [RedisController, 'flush']).as('redis.flush')
route.delete('/redis/:slug', [RedisController, 'destroy']).as('redis.destroy')

route.get('/profile/edit', [ProfilesController, 'edit']).as('profiles.edit').use(middleware.auth())
route.put('/profiles', [ProfilesController, 'update']).as('profiles.update').use(middleware.auth())
route.get('/profiles/:id', [ProfilesController, 'show']).as('profiles.show')

route
  .group(() => {
    route
      .get('/register', [RegisterController, 'show'])
      .as('register.show')
      .use(middleware.guest())

    route
      .post('/register', [RegisterController, 'store'])
      .as('register.store')
      .use(middleware.guest())

    route.get('/login', [LoginController, 'show']).as('login.show').use(middleware.guest())
    route.post('/login', [LoginController, 'store']).as('login.store').use(middleware.guest())

    route.post('/logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())
  })
  .prefix('/auth')
  .as('auth')

route
  .group(() => {
    route.get('/', [AdminDashboardController, 'handle']).as('dashboard')
  })
  .prefix('/admin')
  .as('admin')
  .use(middleware.admin())

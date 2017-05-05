var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs');

gulp.task('browser-sync',function(){
    browserSync({
        server:{
            baseDir: ''//директория сервера(там где лежат странички)
        },
        notify:false
    });
});

gulp.task('sass-task',function(){
	return gulp.src('dev/sass/**/*.+(scss|sass)')//путь к файлам
		.pipe(sass())//какой компонент(функция, хз как назвать еще) выполняем
		.pipe(gulp.dest('app/css'))//куда кладем полученные файлы
                .pipe(browserSync.reload({stream:true}))//перезапустим страничку
});

gulp.task('scripts',function(){
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',//подключаем бибиотеки в конце обязательно запятая
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
    ])
        .pipe(concat('libs.min.js'))//объединяем в один файл
        .pipe(uglify())//сжимаем 
        .pipe(gulp.dest('app/js'));//перемещаем куда нужно
});

//в скобках запускаем те таски которые должны запуститься до watch
gulp.task('watch', ['browser-sync','sass-task'], function(){
	gulp.watch('dev/sass/**/*.+(scss|sass)',['sass-task']);
        gulp.watch('*.html',browserSync.reload);//релодим при изменеии файлов html в главной директории
        gulp.watch('app/**/*.js',browserSync.reload);//релодим при изменеии файлов js
});

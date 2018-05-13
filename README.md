# Solution to messaging-app assignment

Assignment repo: [messaging-app](https://github.com/Opal-teaching/messaging-app)

Things to note:
- Added automatic documentation for the entire project.
    - __How did I do this?__
   Added to more dev npm dependencies, 'gulp' and 'gulp-ngdocs'
   As mentioned before gulp allows you to create tasks that are
   important in your software development. Check the `gulpfile.js` file
    I created one
   task in particular.  This task simply grabs the files that match `./app/js/**/*.js`,
  and passes them through the `ngdocs` package, finally
  I save my documentation in the `./docs` folder.
   ```
   gulp.task("docs",function(){
   	return gulp.src(["./app/js/**/*.js"])
   		.pipe(gulp_ngdocs.process())
   		.pipe(gulp.dest('./docs'));
   });
   ```
   - __How do I run documentation?__
    ```
    gulp docs
    ```
   - __How do I check the documentation?__
   Navigate to the `docs` folder and start a server there
   using `http-server`

   __Please provide documentation for your own projects__

- Added a search bar text as example. Now
we can filter conversations by name.
- Sorted conversations by lastMessage date. Changed
    the event listener to a 'prepop' event.
   Now the conversations are sorted by their lastMessage
   date.

__Please add a search bar to your messages and sort the list of conversations__


<div align="center">
  <img src="./client/public/github_mini_logo_light_with_bg.png" width="126" alt="HCB logo">
  <h1>Numitz</h1>
  Starting with math, we'll make all STEM fun (ever heard of <a href="https://www.chess.com/">chess.com</a>) 
</div>
<br>



> [!WARNING]
> The site is still in early stages of development some pages maybe incomplete and/or contain bugs. 

## What is Numitz?

Numitz (previously called Mathforces) is a competitive math platform with the promise of having the largest open-source decentralized library of math questions and online competitions on the internet. Think chess.com or codeforces.com but for Math. 

## Table of contents
- [What is Numitz?](#what-is-numitz)
- [Problem we're solving](#problem-we're-solving)
- [Solution](#solution)
- [Key features](#key-features)
- [How to use](#how-to-use)

## Problem we're solving
- No online library of problems raning in difficulty and topic ([previous attempts](#links))
- Math sites look horrible (i.e. biggest math webiste: [Art of problem solving](https://artofproblemsolving.com/wiki/index.php/AMC_10_Problems_and_Solutions?srsltid=AfmBOopUgXQIHynLxR4x4Hq0_bZKL3TocC2v_IMquQTAqtY3rHXpDmeI))
- Text books are currently the only viable way to get ready for math competitions or learn cool deep topics.
- There is no fun. chess.com gamified chess (when it did it blew up in popularity). [codeforces](codeforces.com) and [leetcode](leetcode.com) gamified coding. It's time STEM subjects to do so too and we're starting with Maths.

## Solution
- Get every question in every book, blogpost, open library, or contest digitized and into the database.
- Run them through a series of moderated models to set category, difficulty, and many other attributes.
- Have a contest each 2 days
- Implement [Elo-based](https://en.wikipedia.org/wiki/Elo_rating_system) rating with naming conventions like (Newbie, pupil, specialist, expert...etc like in [codeforces](codeforces.com)) 

## Key features 
### Social media like community 
  * Add your friends & dual them in a 1v1
  * Add your school group and all enter a timed ranked contest 
  * Your gained Elo points, is someone else's loss. Just like bitcoin. That's we're the fun is.

### Filtration
Having a massive database of problems that are filtrable down to the last detail (i.e difficulty, source, topic (or sub-topic), number of people attempted, % of people solved )

So if you want to solve a *Calculs ||* problem that was from this *specific book* and it's difficulty is only *+-100 points* away from your rating, you could do so.

### Contests approach

When I did competitive programming on codeforces all I cared about was getting to the next rating, if that meant learning 3 new algorithms and solving 200 problems, so that on the next rated contest I can earn extra points, so be it. That level of addiction and dedication to learning is exactly what I am aiming for.

## How to use
> [!NOTE]
> All the data used in the developer version of the site are mock data (mainly from [putnam archive](https://kskedlaya.org/putnam-archive/))

Just enter the website. Sign up. and start with: 
### Contest page
- Enter the contests page and select any contest named putnam
For Simplicity all correct answers are set to 1
- You can't start a contest (as of now) Live contests where you can will be added sooon!
- Most tabs are still under constructions except for main ones (Problems, problem statement, Submissions (including your submissions, and general ones))

### Problemset page


- Here you can find the problems that were in past contests neatly arranged
- You can currently sort by difficulty and the percentage of people that correctly solved a problem


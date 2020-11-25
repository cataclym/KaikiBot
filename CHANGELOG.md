de7dc51 (HEAD -> master, origin/master) Edit: Emote DB check doesnt check every server when new server is added.
1374eac Edit: Streamlined console logging a bit
2e9c4e5 Edit: functions => util
5ca4c0a Edit: holiday
2279656 Added: embed function for error msgs, partly editing holiday
97dfd57 Edit: sinfo displays special channels (system channel, etc.)
19424f9 Merge remote-tracking branch 'origin/master'
7d20f59 (tag: 3.3.2) Edit: ec sorted by uses and id // Are you happy now, Dan??
c728858 v3.3.2
e8652b8 Edit: Safety Jim (trim) here to save the day.
f852da3 Added: Neat function to send codeblocks
b3267ea Edit: Replace ":" on emote names. Hopefully that fixes that issue.
5b088b0 Edit: Emotecount, new alias, added flag, sort emotes by id, string trim
bff9118 Edit: Help asks for args if args are provided but parsing fails.
35b61f8 google is a POS
768921d Merge remote-tracking branch 'origin/master'
43bd3f5 Fix: Adding bots or enabling anniversary roles no longer checks bots.
01c9656 Version up: 3.3.1
64d66ed Merge remote-tracking branch 'origin/master'
bf4e432 ☑️ Updated: roleDelete, inRole, restore
0d73650 ✅ Added: createRole
a4157da Fixed: inrole. To a degree.
082897d Merge remote-tracking branch 'origin/master'
7cec22e ✅ Added: inRole, needs minor fixes
ac22449 ✅ Added rolerename
2f9976e Fixing presence further in uinfo
47faffe addemotes alias+description added.
ea2f602 Removed unnecessary variable and forbidden non-null assertion
1940dce Removed forbidden non-null assertion
17baabe Addemote: Using emoji as arg & omitting name defaults to emoji name
98b79e7 Minor fix to tinder and uinfo
2d22af8 Merge remote-tracking branch 'origin/master'
f2b6692 ✨ v3.3 + cleaning
70fb6ea ✨Dynamic usage✨
62762b0 ✨Dynamic usage✨
c234c7e ✨Dynamically shows cmd usage if args fail✨
b6b0490 Some ts edits // Planned module removed
a85636b Merge remote-tracking branch 'origin/master'
f3c9f66 Fixed roledelete
eb2965d Better av cmd
9efef22 Emote(s) add working! p3.
e86dfcb Merge remote-tracking branch 'origin/master'
10d639e emote p2
eaaa2c9 reddit edit
daad8ff Some dumb thing, I think it works
ebc5795 emote prep p1
c1a69cc roleRename.ts
bc14e66 3.2.1: fixes to reddit / remove useless cmds / interface for reddit json
4babca9 cmd rr.ts
ee63182 Files were missing public (async) exec
5c39157 Contribute field
cb056f2 Node 14.
0e55a19 Make it werk
72b049b no cache?
6aa1229 o
456bfc0 pipeline
5eef734 GitLab.
baa026e 🎁 rinfo
ab09e50 Tinder flag+match edit
80d4511 🦄 fetch fix p2.✅
0b7cb30 fetch fix p1 + stats
f553b86 🟢 Updated commands 🟢
a600c2c missingPerms listener
55160f6 lol
b6d44c4 aaaa
141303f Merge remote-tracking branch 'origin/master'
7ff9218 Exploring game logic and implementing stateless ttt. IK, bad.
d4e754f cd
5327de5 urban title/link
b179338 ✍️ Utility, edited names.ts
23df246 ✨ New cmds: woof, meow, urban dictionary
a485f6e Substring edits, misc. edits
f2d24fa Owner only, setAv, setName
221cf85 Moved config again, template
c2498ee move conf
7f5418e Remove jimp
1fb8f12 revert simp
a55a51b No error when there are no emotes x2
1f25316 Optional description field on commands.
6665572 No self msgs
148c709 Potential guild emotecount fix
b773d44 dr cant be saved, thanks.
cc59cbc Rolelist sorted by hierarchy
2eada39 dr goes drrrrrr
f128045 RD
f2df2ea Auto stash before merge of "master" and "origin/master"
1e5dfee Merge remote-tracking branch 'origin/master'
939f7e9 default clear number, toggles bool edit, role delete potential fix.
a4de4a0 jimp test, replacing canvas in simp
88491b4 etc. cleanup
cd22ed2 updated packages
7a97272 d.js UserFlag update
831729d postgres and jimp
3aec919 Merge remote-tracking branch 'origin/master'
9c8d33f Emit cmd
e131fcd emit cmd
e2585f8 hentai exclude tag
70f43eb Cant figure out the json resonses
0e79700 misc commands: reddit/nsfwtgl
9763054 embed noArgRole/TS config
2acfdd4 New Role cmds category and 4cmds
c8a500f Merge remote-tracking branch 'origin/master'
b93a0e3 Invite cmd
cd14cae Move config cmds, edit ban/kick usage
9bc1587 Clear cmd, simp is TS too.
19298da Added smarter presence
c9f0fc4 Merge remote-tracking branch 'origin/master'
903af55 kick/ban desc
0723c77 eval fix
ee78833 Working admin commands/edits to Util and message listener
555f448 added eval
f44708f Update for admin commands
d535705 Auto stash before merge of "master" and "origin/master"
a15dee6 Work on ban and kick
bbd0c75 Added administration module with ban/kick/ub
1662de1 misc nsfw, test, tinder
a3779a3 misc. edits to tinder and sinfo
18d6317 The rest of quickdb's types corrected and cleaned.
9bbc0ca db types
bf46b36 More necessary types.
e482df3 Cleanup + quick.db types?
6a3ad43 Revert "SQL Preparation"
7d585ac Manual timing on reacts
a7e0b06 Merge remote-tracking branch 'origin/master'
025d4bc 123
e3ebcae Ratelimits for reactions make me vomit
e9c05d6 Hopefully ratelimit prevention.
04bbf5e SQL Preparation
6f7e18e Create LICENSE
ca4500c Fixed todo +command to restore todo
4821ee6 (tag: 3.0.2) Merge remote-tracking branch 'origin/dev'
f2e8b75 No pm2 support / package
d108f36 Tonnes of nitpicks, cleanup+README edit+bugs
d099358 Merge remote-tracking branch 'origin/dev'
23317a7 edit to paginated embed in list
b087ed2 Merge remote-tracking branch 'origin/dev'
9645fae uinfo+fetch edits
2592db2 test
55f57cc Deps, small edits, readme
8d1daae fixes cmds
83d140c listeners
910fb0d Bunch of new listeners!!
4770d37 Tweaks to commands and listeners
09e7d4d top level scope array
9647b6d new command, sinfo
4f0f3e3 Trying to fix random odd missing results in hentai
5fba058 Convert config+added colors
636f497 cmds and uinfo destructuring
314e7c3 Tinder no aliases for cmdslist compatibility
cb4825a args destructuring
7639b44 4 new commands, avatar+fun
73453e2 ignore dist 👌
c14bf45 Time to celebrate 🎊
35ddff5 Removed package.json from stats
c8cfec5 Some tinder fixes
12c810e v3 prep, throw error if missing prefix, error trace
d4aee03 New config file
63c3ad1 Fix node canvas
3b63f09 Utility conversion progress
c1fe9dd Functions converted, fix dadbot mentions
d0241b7 All the listeners
e2af7cc remove random listener from client
9ae7ee2 tsconf
a85ed13 New index and separate client file
9f36817 Moved listeners / Yet to convert
775bd36 es2020 tsconf
3c52dbe All of the tinder subcommands
799a526 Useless commands.
b656482 Some functions changes from master
f953ae6 throw new Error change for hentai
1a805bc pagination for names
949e10b Embeds fix
907f17f Owner only conversion
be68094 Tinder updates
8c5dca2 Update to own pagination dependency
38244da Don't need these anymore.
ce7fbae Last commit. Time to sleep
8cd01bb Embeds and functions conversion
2028b84 Tinder command conversion - functions/tinder.ts is not done.
988c226 Converting some more fun commands
0094720 Types for pagination
f5a0a74 Converting commands from cmds/Fun+Create custom types
f40800b Converted functions to TS
abbe4ad Converted embeds to TS
70857bd 🟦🟦More TS conversion🟦🟦
25d66ab Guh 💔
5e057a1 hentai almost working 🦄🦄🦄
9cf7bb6 TSconfig related, and VSC integration for tslint
a802c6f Updated promises and types. Added member color Utility
fa57f42 👁️‍🗨️Bot mention fix and some functions.js edits
07476e2 Useful commit msg
33a1cc6 Hentai cmd work. Issues with condition.
012ea98 Untracking DB
d6c5d06 Dev is now partly a TS branch 🟦📘
d964d25 TS support
37b12f5 Merge pull request #46 from cataclym/dev
f2c3b52 Merge branch 'master' into dev
ff809fb 💛✅ gitignore is nice.
bd10ccc 💖 Remove some debug, ready for master branch
87e3c20 :100: Commit restore command
391969c Anniversary roles fix+toggle for dadbot/anniversary
9859151 Timing async reactions :thumbsdown:
a828dd4 :doughnut: Akairo conversion P5
a63d481 :date: rev5 anniroles
4f53c46 smh
e5e2a0b :fire: Anniroles perf p3
b19bc39 :100: anniroles perf p2
b43e931 :bomb: Perfomance increase for anniroles
e9d3a84 :+1: Small fix to date
2b302b4 :joy_cat: From dev, update to AnniversaryRoles
03370ca Revert "Stop tracking config, db"
7adcd61 Stop tracking config, db
aea3a0f hotfix for emote react and dependencies
19fc36a :apple: Akairo p4 :+1:
6c0e179 :thumbsup: Akairo P3 - tinder :heart:
a4540a1 Akairo part2 most commands done
107ce41 Converting to Akairo Update1
ab150a7 Merge pull request #43 from cataclym/dev
4efaaef 1.3.4 update, fixes and renaming
7f31da8 Merge pull request #42 from cataclym/dev
aefb60a updated deps
1bc0ce6 Merge pull request #40 from cataclym/dev
3094696 Emotecount hotfix
dfd8b29 Merge pull request #39 from cataclym/dev
7a896e2 minor Tinder list edit
390c0df Merge pull request #38 from cataclym/dev
1aa77de 1.3.2 - No more bots in Tinder
cd7804b Merge pull request #37 from cataclym/dev
bb1e937 Update 1
8bf5a24 eslint changes :+1:
b15a4b5 Merge pull request #36 from cataclym/dev
df9421d Merge branch 'dev' of https://github.com/cataclym/nadekosengokubot into dev
7eb6e73 Final v1.3 commit?
d525c1a H-API description
f9b1287 Update to readme
2c4b5bb extras
b7b549e Project midway update
256d269 Merge pull request #35 from cataclym/dev
6107540 actual ping
a08cc3b Merge pull request #34 from cataclym/dev
192222e tiny fix to tiny issue
de9bc95 Merge pull request #33 from cataclym/dev
81cac32 I wrote a big message earlier, but had to revert. This update is kinda big
6f38f88 Merge pull request #32 from cataclym/dev
16b46a0 Tinder fixes, implemented lists and dislike removal fixes: nothing shows twice in lists, removed typing events, optimized lists code, max 20 entries per field in embed list and some more
a6ab635 Update README.md
edabd22 Merge pull request #31 from cataclym/dev
fbc7bf0 Fix to marry() Rolls upped to 15
13ea6e5 Fix to marry() Rolls upped to 15
17fcce8 Merge pull request #30 from cataclym/dev
d711fc7 Added TinderDBService
9f52ead Merge pull request #29 from cataclym/dev
80537f2 Fix to Tinder reset time and Emotecount
bd9e7b3 Fix to Tinder reset time and Emotecount
2ef0c63 Merge pull request #28 from cataclym/dev
add34e3 Added time left for rolls/likes
41b9486 Added time left for rolls/likes
0ac8d87 Merge pull request #27 from cataclym/dev
7e25cf5 Add files via upload
7105a4d Add files via upload
cac12f6 Delete emotecount.js
7597d54 Delete functions.js
4bbe7cc Fixes to emotecount ++
2360127 Merge pull request #26 from cataclym/dev
6310d3f hotfix
00265c2 Merge pull request #25 from cataclym/dev
eeba6e8 Merge branch 'master' into dev
a108756 Final?
2d99ece Maybe final commit
716b81c (Not) final commit
39c0773 new cmd
528121f ayayayay
3249d16 ez fixes
7937511 Changed Tinder DB table
c36aadf Here u go
53c1892 broken heart react
7694a26 tinder+
52d6eb0 arvvv
8734a38 new function
3d501b6 owo switch statement
b4caa62 redone todo cmds
1364cb0 Reacts still dont work
f3e1aa4 tinder update1
5fff320 Merge pull request #22 from cataclym/dev
83cd7c2 oh yeah mr crabs
71e5dc7 Merge pull request #19 from cataclym/dev
75f03d6 Embeds++
66704be Update README.md
4e6a5ea Merge pull request #18 from cataclym/dev
1b44e3f Fixes to help and names
3657272 Merge pull request #17 from cataclym/dev
39d6bbc help/names ++
fd75d24 Merge pull request #16 from cataclym/dev
60dba49 disable command breaking help
20bd06b Merge pull request #15 from cataclym/dev
d999482 Fixes to cmd and help
edfe4d9 Merge pull request #14 from cataclym/dev
46989fa quick admin only
3128c69 Merge pull request #13 from cataclym/dev
356aa5d misc
916caff comments+
41a5c83 Updatenames+cmdslist++
6caaa72 Merge pull request #12 from cataclym/dev
ade6348 Merge branch 'master' into dev
51e2add Big update/+todo++
00f5d5b Fix merge leftovers
fb27260 Merge branch 'dev' of https://github.com/cataclym/nadekosengokubot into dev
da12ec7 update 5
cf03fd6 update 4
2fe263c update 3
836fc28 update 2
1fd9e12 update 1
1003ee7 Merge pull request #11 from cataclym/master
d0906ff Merge branch 'dev'
bca9d9a clean db
fc3e65b cmdlist+aliases
4483e95 Update .gitignore
4e24a62 Merge branch 'dev' of https://github.com/cataclym/nadekosengokubot into dev
068d2c4 indented++
afd62cd new ver
6452d75 Update .eslintrc.json
c0ea52e Update config.json
bb1548d indents+fix for names.js
d27858c Add files via upload
584e721 Delete config.json
35d800c Indentation fixes +names, db
f2613b7 Lint index.js too
9db56e6 Fix auto-fixable warnings/errors
6260a9c Update eslint config
258c2b0 Remove browser env, add extra eslint rules
9fc3128 Add gitattributes and gitignore
3f249a3 here u go
0b16aa3 here u go
8037b41 Fix indentation
07e8db7 Update functions.js
e55c6b9 Update names.js
5cdcdc3 Testing DB ON BRANCH
972b6f2 Revert "Testing DB"
e1a233b Testing DB
54b973b Updated description, about, thanks, features
61fe9cf Merge pull request #7 from cataclym/dev
3b1e74e Merge branch 'master' into dev
0110332 +++
bec1cd0 Update yeet.js
7f4be5c Update variables.js
fa5d7e6 (tag: v.1.6) Permission invite link
e0e1e2f thx + yeet + perms
bd1e1c5 Thx <3
15653bf Update dadjoke.js
f598ca8 Bot typing added
3eab8fe Merge pull request #6 from cataclym/dev
3801e93 new cmd, minor fixes tweaks
eac6d3f prettier
c4485b5 Prettier
d2f3f85 Merge pull request #5 from cataclym/dev
9accf10 this should work
9ce191a Merge pull request #4 from cataclym/dev
b2dce1f Merge branch 'master' into dev
d057da1 pretty embed for mentions
a132e04 Pretty embeds
bb3d2be hotfix for infinite repeat
594080e Merge pull request #3 from cataclym/dev
e19f662 Add files via upload
820496e exciting exclude command +more
3da9cb9 removed old function
fb3a7ea Delete delete
5fe5814 Add files via upload
023e55e Rename config.json to delete
bb41b27 changed color to display the user's
8553167 Update config.json
03a0fc7 changes
6c9327d Fixes to exclusions and more
b21b897 this should fix exclusion
a5b87e3 Added help.
a77f878 changed prefix
d667da1 added help and dadjoke
4cade89 updated location
7b9298e Update README.md
a93920a no space after prefixes2
074b452 original +some
561d0dc Merge pull request #1 from cataclym/ExportFunc
05992d0 Ready to merge
a0f973c This should work now
e783376 Exported functions should work now!
fdae979 Update index.js
3f18d1a Update functions.js
c3ef6b5 Update index.js
a3ae388 Update index.js
0f03a90 Add files via upload
f68735c Delete variables.js
a70c654 Delete nadekosengokubotMasterCW.code-workspace
37daa52 Update config.json
946b53a tetst
5598c2c Tests
79810cc No longer spams perms error for owner.
a984868 Update README.md
0ca4109 Update README.md
ae87d75 Added discord embed yoo
156297e Added comments and changed reaction method.
620b4db Comments
ca934c5 Overhaul! Thanks to rjt!
d43c040 the prefix is now "æ"
0f63e29 the exclude role file
f05fc8e Can now properly exclude a role +fixes
861c9b9 Update README.md
77ffe59 Update package.json
d7db6f2 Update package.json
43061ce Added excluded roles
21c4c23 excluded roles added
645f825 Excluded roles addition
9b9bc15 hotfix xd
c93b7cd Removed npm install ++
96c28b8 added the external variable file
d617aee Update index.js
72f84c0 Removed the node install ++
88d47f9 Update index.js
e122551 Thanks Arv
c74957c Update README.md
37897e5 Added prefixes / and prefix slice lengths!
2277e52 Update README.md
1094145 Update package.json
77d52ba POG UPDATED
0abfbab Added case insensitivity POGGERS
d85d914 Update README.md
9e7b1ab Update README.md
ecac2b7 Update README.md
653a74a Update package.json
107b85d Update package.json
b167c08 Update README.md
cac4a4e Create README.md
63e2377 Add files via upload

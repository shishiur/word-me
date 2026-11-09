# -*- coding: utf-8 -*-
"""Evidence matrix, quote audit, preflight and source inventory -> xlsx + csv."""
import os, csv
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out"); os.makedirs(OUT, exist_ok=True)

JOY  = "Joypur community interview, Bengali Field Interview Full Transcript.txt (01:00:04)"
GRP  = "Group Discussion Vulnerability Transcript And Translation.txt (00:13:40)"
LEC  = "Climate Change Complex Systems Full Lecture Transcript (00:32:46)"
K1   = "Tanguar_Haor_CNRS_KII_Combined_Parts_01_02.pdf (Part 01)"
K2   = "Tanguar_Haor_CNRS_KII_Combined_Parts_01_02.pdf (Part 02)"
BOAT = "Tanguar_Haor_Boatman_Interview_Expanded_Notes.pdf (audio 20261108_125218.m4a, 28:59)"
SAU  = "Commons_Governance_SAU.pdf"
N6   = "NAYAK - Field Workshop Sylhet - 6 November 2026.pdf"
N8   = "NAYAK - Social-Ecological Systems - 8 November 2026.pdf"

HDR = ["ID","Question","Source file","Exact time or page","Extracted claim, as recorded",
       "Evidence category","Theory applied","Uncertainty / caveat","Slide","Speaker"]

M = [
# ---------------------------------------------------------------- Q1
["Q1-01","Q1",SAU,"p. 1","Official wording: 'What makes Tanguar Haor an ephemeral commons? What are the key characteristics or attributes that help explain Tanguar Haor as an ephemeral commons?'","WORKSHOP LECTURE/SLIDE","-","Controlling source for the question wording and sequence.","3","1"],
["Q1-02","Q1",N6,"Ephemeral Commons slides","Ephemeral commons: the natural process that creates the resource produces ecologically ephemeral territories; cyclical creation and dissolution deny it a permanent character; cycle of emergence-submergence (Singh 2021 ch.4; Mukherjee 2011).","WORKSHOP LECTURE/SLIDE","Ephemeral commons; emergence-submergence","Concept, not a local finding.","3, 4","1"],
["Q1-03","Q1",JOY,"00:03:27","Flood water and the embankment discussed; the haor described as silting.","DIRECT PARTICIPANT TESTIMONY","Ephemeral commons","Mechanism not measured by us.","3","1"],
["Q1-04","Q1",JOY,"00:12:17-00:13:52","Work described across the year: fishing, boat work for tourists, paddy, wage labour.","DIRECT PARTICIPANT TESTIMONY","Temporal scale; adaptive livelihoods","Not evidence of prevalence across households.","3","1"],
["Q1-05","Q1",JOY,"00:29:00","Fishing access described as roughly a three-month window, with the sanctuary excluded; fish escaping the lessees' operations are caught.","DIRECT PARTICIPANT TESTIMONY","Excludability","Participant report; no lease document seen.","3, 4","1"],
["Q1-06","Q1",JOY,"00:50:43","Ban months given as Joishtho, Asharh and Srabon, and said to apply everywhere, not only the sanctuary.","DIRECT PARTICIPANT TESTIMONY","Rules-in-use vs rules-on-paper","No gazette or notice seen by us.","3","1"],
["Q1-07","Q1",JOY,"00:27:21","'when the lessee was here, the lessee kept order, people could not take fish'; ten guns said to have been on the Tanguar beel.","DIRECT PARTICIPANT TESTIMONY","Excludability; governance","Memory of a period ending about 2000.","4","1"],
["Q1-08","Q1",JOY,"00:28:11","Same speaker: the present arrangement suits them.","DIRECT PARTICIPANT TESTIMONY","Commonisation / decommonisation","Direct internal contradiction with Q1-07; preserved, not resolved.","4","1"],
["Q1-09","Q1",JOY,"00:49:44-00:50:00","Of about fifty short machines operating, two are caught, fined and released.","DIRECT PARTICIPANT TESTIMONY","Excludability; cost of exclusion","Participant estimate, not an enforcement record.","4","1"],
["Q1-10","Q1",K1,"Section 02, historical administration","Gauripur Estate under the British; lease-based under Pakistan and after independence; declared lease-free in 2000; management moved from the Ministry of Land to Environment and Forests.","PROFESSIONAL KII TESTIMONY","Institutional change","Attributed testimony; no instrument verified by us.","4 (notes)","1"],
# ---------------------------------------------------------------- Q2
["Q2-01","Q2",SAU,"p. 1","Official wording: 'What are the main issues and challenges facing the Haor? What are the important drivers, impacts, and social-ecological changes they are creating?'","WORKSHOP LECTURE/SLIDE","-","Controlling source.","5","2"],
["Q2-02","Q2",JOY,"00:04:42, 00:05:09","The community asked for the embankment; CBRMP built it; ten to twelve years of harvests credited to it.","DIRECT PARTICIPANT TESTIMONY","Nonlinearity; trade-offs","Project name given by our mentor at group discussion 00:05:08.","5","2"],
["Q2-03","Q2",JOY,"00:31:26-00:32:53","Embankment closed in Chaitra dries the crop field; fish cannot survive the drying; when it breaks in Magh or Falgun water returns and fish spawn.","DIRECT PARTICIPANT TESTIMONY","Nonlinearity; seasonal trade-off","Causal mechanism as described by the participant; not independently verified.","5","2"],
["Q2-04","Q2",JOY,"00:45:44","'the kanda is thin now; if it is cut two or four more times all of it becomes a mound ... right now we are surviving, that is fine, but for the future...'","DIRECT PARTICIPANT TESTIMONY","Uncertainty; temporal scale","Sentence left unfinished by the speaker; quoted as such.","5","2"],
["Q2-05","Q2",JOY,"00:44:40","Turbid flood water brings mountain soil, fills the haor; 'the haor is rising up'.","DIRECT PARTICIPANT TESTIMONY","Scale; sedimentation","Lay explanation, consistent with but not confirming Q2-07.","6","2"],
["Q2-06","Q2",JOY,"00:48:27","Large boats can no longer reach this place; they used to be able to.","DIRECT PARTICIPANT TESTIMONY","Scale; depth change","Navigation proxy for depth; no bathymetry.","6","2"],
["Q2-07","Q2",K1,"Section 5.2","Coal and limestone extraction and erosion in the Meghalaya hills upstream send sand and silt down; beels and connection points fill; depth and flow fall. Upstream erosion control recommended.","PROFESSIONAL KII TESTIMONY","Scale and levels; transboundary driver","Attributed; no sediment data supplied.","6","2"],
["Q2-08","Q2",K2,"Section 08","Asked whether the water is turbid all year, the informant attributed silt mainly to monsoon rainfall and did not describe a year-round flow.","PROFESSIONAL KII TESTIMONY","Scale","Useful correction against overstating the mechanism.","6 (notes)","2"],
["Q2-09","Q2",JOY,"00:11:44-00:12:13","'the current net does not destroy fish' - used since birth, for eating; the short machine and the kona jal named as the destroyers. Another speaker names the china duari.","DIRECT PARTICIPANT TESTIMONY","Subtractability; rules-in-use","Participants disagree with one another; disagreement preserved.","6","2"],
["Q2-10","Q2",JOY,"00:49:37","Asked who uses the shortgun and kona jal: 'no, people from here, people of this very Tanguar'.","DIRECT PARTICIPANT TESTIMONY","Excludability; internal attribution","Contradicts the outsider hypothesis we arrived with.","6","2"],
["Q2-11","Q2",JOY,"00:30:13","'there is no katha bamboo, and there is no enforcement like before.'","DIRECT PARTICIPANT TESTIMONY","Decommonisation","Two causes named by the participant, not ranked.","6 (notes)","2"],
["Q2-12","Q2",LEC,"00:14:27, 00:22:24","'what we might think is a local problem is actually an interconnected problem'; the scale of the problem must match the scale of intervention, otherwise 'governance misfit'.","WORKSHOP LECTURE/SLIDE","Scale and levels","Theory, applied by us to the Tanguar material.","6","2"],
["Q2-13","Q2",K1,"Section 04","An earlier government assessment is reported at 141 fish species; recent CNRS fish-catch monitoring about two months earlier found 68.","PROFESSIONAL KII TESTIMONY","Ecological change","NOT 73 extinctions: different methods, windows and scopes. Subtraction refused.","14","6"],
# ---------------------------------------------------------------- Q3
["Q3-01","Q3",SAU,"p. 1","Official wording: 'What does vulnerability look like in specific relation to its (Tanguar Haor) ephemeral nature?'","WORKSHOP LECTURE/SLIDE","-","Controlling source.","7","3"],
["Q3-02","Q3",GRP,"00:01:06-00:01:33","Catch described as about half a kilo now; transport to the town market costs 200-250 taka and two hours; nekari buy in the village; price described as unfair.","TEAM'S INTERPRETATION of field accounts","Market access; livelihood exposure","Team summary of the day, not a verbatim community statement.","7","3"],
["Q3-03","Q3",JOY,"00:40:14-00:40:44","Sunamganj market price about 200 taka a kg with a 10-20 taka local discount; dried fish 300 in the market but 300-500 taka to travel, so sold at 250 locally.","DIRECT PARTICIPANT TESTIMONY","Market access; subtractability","Participant figures, not audited.","7","3"],
["Q3-04","Q3",GRP,"00:02:41-00:03:28","Sacks observed in the house; team concluded rice was stored in empty fish-feed bags against uncertainty.","OBSERVED BY TEAM + TEAM'S INTERPRETATION","Uncertainty; coping","Storage observed; the reason is our inference. Labelled as such on the slide.","7","3"],
["Q3-05","Q3",JOY,"00:33:00","'they are uneducated people, they say we live by eating' - on why telling people not to fish does not work.","DIRECT PARTICIPANT TESTIMONY","Vulnerability; compliance","Speaker reporting others' view, not his own confession.","7","3"],
["Q3-06","Q3",K1,"Section 7.3","Without food security in a poor fishing household, awareness alone cannot stop fishing; other household members may fish for livelihood.","PROFESSIONAL KII TESTIMONY","Vulnerability; governability","Independent corroboration of Q3-05.","7","3"],
["Q3-07","Q3",GRP,"00:10:43-00:10:54","Team member describes the three-month lease as the reason people stay, and recalls the answer 'we steal, we drive a rickshaw' for the remaining months.","TEAM'S INTERPRETATION","Coping; adaptive livelihoods","NOT a verbatim community quote. Related community line at Joypur 00:28:33.","8","3"],
["Q3-08","Q3",JOY,"00:50:30","Ban compensation: 'they gave it once. Rice once in the three months, I think for two years.'","DIRECT PARTICIPANT TESTIMONY","Entitlement delivery","Participant recall of timing; no programme record seen.","8","3"],
["Q3-09","Q3",JOY,"00:54:51, 00:54:55","Family card and the monthly 2,500 taka scheme: 'not one person here has got it'; known from television speeches.","DIRECT PARTICIPANT TESTIMONY","Institutional reach","Applies to this settlement as described, not to the haor generally.","8","3"],
["Q3-10","Q3",JOY,"00:55:09","Electricity present; 'out of twenty-four hours it stays about eight'.","DIRECT PARTICIPANT TESTIMONY","Basic needs","Single participant estimate.","8","3"],
["Q3-11","Q3",JOY,"00:17:19-00:18:29","Three tubewells reported not working; a submersible connection used; river water preferred because the tubewell water 'has no taste'.","DIRECT PARTICIPANT TESTIMONY","Infrastructure vs usability","Water quality untested by us or, as far as we were told, by anyone here.","9","4"],
["Q3-12","Q3",GRP,"00:06:05-00:09:19","One submersible for the kanda, 20 taka per household per month collected by a member; piped water used for drinking and cooking, not bathing.","TEAM'S INTERPRETATION of field accounts","Infrastructure vs usability","Team summary; fee and collector not independently confirmed.","9","4"],
["Q3-13","Q3",GRP,"00:07:14-00:08:08","Discussion of skin irritation and menstrual-hygiene discomfort associated with turbid water; described as an emerging issue of unknown severity.","TEAM'S INTERPRETATION","Emergence; vulnerability","HYPOTHESIS ONLY. No causal or medical claim is made or implied.","9 (notes)","4"],
["Q3-14","Q3",JOY,"00:16:28","'it would be one kilometre. When we go we have to cross three rivers.'","DIRECT PARTICIPANT TESTIMONY","Seasonal access","Repeated at 00:46:16 as 'one kilometre away'.","10","4"],
["Q3-15","Q3",GRP,"00:03:54, 00:04:01","One member says they did not hear the distance; another says four kilometres with three rivers.","TEAM'S INTERPRETATION","Seasonal access","UNRESOLVED DISCREPANCY against Q3-14. Both reported; neither chosen.","10","4"],
["Q3-16","Q3",JOY,"00:38:38-00:39:01","Hospital at Tahirpur; 'in the monsoon it is death'; travel by hand-rowed boat.","DIRECT PARTICIPANT TESTIMONY","Basic needs; care access","Quoted as spoken; no mortality data.","9","4"],
["Q3-17","Q3",GRP,"00:06:35-00:06:55","A maternal death during transport last year, and traditional home delivery, described in team discussion.","TEAM'S INTERPRETATION of field accounts","Care access","SECOND-HAND. No medically verified cause, date or case.","9","4"],
["Q3-18","Q3",GRP,"00:10:04-00:10:23","Water reportedly reached neck height in homesteads in 2022; the household moved to Netrokona.","TEAM'S INTERPRETATION of field accounts","Displacement; uncertainty","SECOND-HAND; not corroborated in the primary transcript.","12","5"],
["Q3-19","Q3",GRP,"00:03:34-00:03:50","Tin houses; no trees as a windbreak; wind comes off the hills across the open haor onto the kanda and lifts the roofs.","OBSERVED BY TEAM + TEAM'S INTERPRETATION","Exposure","Observation of tin roofs is ours; the wind mechanism is our reading.","9","4"],
["Q3-20","Q3",GRP,"00:11:28-00:12:01","One school; a madrasa on the kanda; one person in the kanda studying at intermediate level; about 70 households.","TEAM'S INTERPRETATION of field accounts","Basic needs; self-organization","Household count is a team recollection; community said 82 villages, not households.","10 (notes)","4"],
["Q3-21","Q3",LEC,"00:11:33","'They brought a madrasa! That could be one element of self-organization.'","WORKSHOP LECTURE/SLIDE","Self-organization","Prof. Nayak's reading. Not evidence that the madrasa functions as a school system.","9","4"],
["Q3-22","Q3",GRP,"00:13:04-00:13:30","Team asserts cultural practice has declined, then notes on tape 'but we did not actually ask this'.","TEAM'S INTERPRETATION","Reflexivity","Used as an example of our own unasked question, not as a finding about culture.","10","4"],
# ---------------------------------------------------------------- Q4
["Q4-01","Q4",SAU,"p. 1","Official wording: 'How are the Haor communities, government and policy people, and civil society responding to the challenges and vulnerabilities across multiple levels? List any specific strategies being adopted.'","WORKSHOP LECTURE/SLIDE","-","Controlling source. No presenter was assigned; bridged by Speaker 5.","11","5"],
["Q4-02","Q4",JOY,"00:35:08","'41 societies, with 82 villages behind them. Among the 82 villages they have made 41 societies.'","DIRECT PARTICIPANT TESTIMONY","Self-governance; nested institutions","Village count conflicts with CNRS (77 / 88).","11","5"],
["Q4-03","Q4",JOY,"00:36:50","Revenue from selling a beel: 24 per cent to government, 76 per cent retained by the central committee for development.","DIRECT PARTICIPANT TESTIMONY","Distribution; institutional governance","Participant report. Requires audit; none available to us.","11 (notes)","5"],
["Q4-04","Q4",JOY,"00:42:00-00:42:33","Disputes are settled by matbor and elders; the society's function is the lease; no savings or lending function.","DIRECT PARTICIPANT TESTIMONY","Self-governance; first order","Single account of how it works in this village.","11","5"],
["Q4-05","Q4",JOY,"00:33:50-00:34:38","ACLand and UNO come and state that fishing is prohibited; miking is sometimes used; the society contacts UNO, DC and upward to the ministry.","DIRECT PARTICIPANT TESTIMONY","Interactive governance; levels","Participants described notice, not explanation of why a gear is harmful.","11","5"],
["Q4-06","Q4",JOY,"00:55:46, 00:56:51","Fisher cards are free through the society; women can now obtain them; 'there are people who do not fish at all and have got fisher cards'.","DIRECT PARTICIPANT TESTIMONY","Identification; entitlement targeting","Participant observation about his own area.","11","5"],
["Q4-07","Q4",JOY,"00:31:02-00:31:26","Fertiliser and pesticide amounts set 'by our own estimate'; 'no officer comes here' and 'we do not go either'.","DIRECT PARTICIPANT TESTIMONY","Institutional reach; knowledge","Mutual non-contact described by the participant.","11 (notes)","5"],
["Q4-08","Q4",K1,"Section 02","Management responsibility sits with Environment and Forests while legal ownership of the land remains under the Ministry of Land; custodianship and ownership are not in the same institution.","PROFESSIONAL KII TESTIMONY","Governance misfit; nested levels","Attributed testimony; no instrument verified by us.","11","5"],
["Q4-09","Q4",K1,"Sections 03, 07","CBSMTHP 2006-2018 in four phases (preparatory, development, consolidation, bridging); a USAID-funded activity ended March 2024; current work includes baseline, village census, water quality, fish-catch monitoring and tourism carrying capacity. Institutions: 41 VDCS to Central VDCS to upazila, district and steering committees, now converting to Village Conservation Groups under the 2016 ECA rules.","PROFESSIONAL KII TESTIMONY","Interactive governance; nested levels","Reported programme history, not an evaluation of outcomes.","11","5"],
["Q4-10","Q4",K1,"Section 08","Enforcement actors named: UNO, Fisheries Department drives, a new Department of Environment field office, an Ansar camp. Manpower and close monitoring described as insufficient.","PROFESSIONAL KII TESTIMONY","Governability","Attributed assessment.","11 (notes)","5"],
["Q4-11","Q4",LEC,"00:14:27-00:16:08","A problem defined at one level cannot be addressed at one level; scales may be temporal, spatial, jurisdictional and institutional.","WORKSHOP LECTURE/SLIDE","Scale and levels","Theory.","11","5"],
# ---------------------------------------------------------------- Q5
["Q5-01","Q5",SAU,"p. 1","Official wording: 'Are vulnerability - viability transitions taking place in Tanguar Haor? How does one understand the transitions?'","WORKSHOP LECTURE/SLIDE","-","Controlling source.","12","5"],
["Q5-02","Q5",N6,"V2V slides","Vulnerability as lack of access to human, physical, natural, social and financial capital; as absence of material, relational and subjective wellbeing; resilience as a way of dealing with vulnerability (Nayak and Berkes 2019).","WORKSHOP LECTURE/SLIDE","Vulnerability to viability","Framework. Our evidence addresses the material dimension almost exclusively.","12","5"],
["Q5-03","Q5",JOY,"00:38:06-00:38:21","An NGO gave boats free; 'we work them for hire'.","DIRECT PARTICIPANT TESTIMONY","Adaptive response","Single household account.","12","5"],
["Q5-04","Q5",JOY,"00:58:01-00:58:24","Visitors are taken from the large boat to the watch tower by small boat at 20 or 50 taka a head; when one boat ties up, ten small boats go out.","DIRECT PARTICIPANT TESTIMONY","Adaptive response; distribution","Participant description of the mechanism.","13","6"],
["Q5-05","Q5",JOY,"00:58:36","'there is no problem from the houseboats. We have income ... I am seeing cash profit.'","DIRECT PARTICIPANT TESTIMONY","Scale; temporal horizon","Given in direct response to our leading question at 00:58:15.","13","6"],
["Q5-06","Q5",JOY,"00:47:12, 00:47:34","Houseboat noise said not to harm fish; the kona jal and short machine blamed instead; polythene left by tourists is the stated complaint.","DIRECT PARTICIPANT TESTIMONY","Rules-in-use; attribution","Consistent with Q5-05 and with Q2-09.","13","6"],
["Q5-07","Q5",K2,"Section 05","Tourism grew suddenly; planning and field control are lacking; houseboats pressure the environment; local people are not receiving the expected livelihood benefit; carrying capacity and participatory management are priorities.","PROFESSIONAL KII TESTIMONY","Scale; distribution","Directly opposed in emphasis to Q5-05. Both retained.","13","6"],
["Q5-08","Q5",JOY,"00:59:22-00:59:43","Three villages described as running a lottery for boat turns; other villages told 'this place is ours, do not come here, go somewhere else'.","DIRECT PARTICIPANT TESTIMONY","Excludability; commonisation","Inter-village exclusion described by a participant.","13 (notes)","6"],
["Q5-09","Q5",BOAT,"18:56-20:11","Houseboats described positively; asked whether the money lasts the year, the answer is 'no, it does not run the whole year'.","DIRECT PARTICIPANT TESTIMONY (note-mediated)","Coping vs viability","Audio exists but no verified transcript; taken from the audited note PDF.","12","5"],
["Q5-10","Q5",K2,"Section 07","Seasonal migration for earth-cutting and farm labour to Tangail, Mymensingh and Sylhet; permanent migration mainly to Dhaka (garment work, security work, domestic work); some risky cross-border coal and limestone labour.","PROFESSIONAL KII TESTIMONY","Adaptive response; mobility","Attributed; proportions described as small for cross-border work.","12","5"],
["Q5-11","Q5",JOY,"00:43:01-00:43:11","NGO instalment loans are given only to women; the men state that they supply the money.","DIRECT PARTICIPANT TESTIMONY","Gendered access; financial capital","Reported by male participants; no woman was interviewed directly.","12","5"],
["Q5-12","Q5",K2,"Section 04.2, 04.3","Turtles not seen for about ten years by one speaker; another saw one in 2022. Dolphins recalled in local rivers. No accessible continuous species-level dataset exists; training local people in identification recommended.","PROFESSIONAL KII TESTIMONY","Ecological change; uncertainty","Memories offered as memories. No baseline.","14","6"],
["Q5-13","Q5",K2,"Section 03","Poisoned birds sell at 400-500 taka each; live-caught birds at 1,200-1,500; fifteen to twenty days of catching can yield one to one and a half lakh taka, so awareness or one-off payments are said not to stop it.","PROFESSIONAL KII TESTIMONY","Incentives; governability","NOT raised with the community by us. Reported figures only.","14 (notes)","6"],
["Q5-14","Q5",N8,"Self-organisation slide; LEC 00:08:20-00:11:33","Self-organization is inherent to complex systems, not acquired.","WORKSHOP LECTURE/SLIDE","Self-organization","Applied critically: not all coping is viability.","12","5"],
# ---------------------------------------------------------------- Q6
["Q6-01","Q6",SAU,"p. 1","Official wording: 'What does the future look like, and what can be done?'","WORKSHOP LECTURE/SLIDE","-","Controlling source.","15","7"],
["Q6-02","Q6",JOY,"00:43:50-00:44:34","Local proposal: deepen the beel by government order, and restore katha bamboo as sanctuary, stated reason being that more fish would then be caught.","DIRECT PARTICIPANT TESTIMONY","Self-organization; local proposal","A proposal, not an impact evaluation. Internal tension flagged, not resolved.","15","7"],
["Q6-03","Q6",JOY,"00:49:03","Lessees are described as bringing one to two crore taka of katha bamboo and keeping fifty to a hundred guards, selling about a hundred crore taka of fish after a year.","DIRECT PARTICIPANT TESTIMONY","Capital; excludability","Participant figures, not audited.","15 (notes)","7"],
["Q6-04","Q6",K1,"Section 06","Planned: large-scale tree planting; re-excavation of one or two silted beels; re-excavation of the old Nazarkhali to Hatirgata connecting channel as a fish pass; ecotourism rules; tourist pre-registration on the St Martin's model; an ecosystem service fee; alternative income for about 400 highly resource-dependent households.","PROFESSIONAL KII TESTIMONY","Interactive governance","PLANS AND INTENTIONS, not established outcomes.","15","7"],
["Q6-05","Q6",K2,"Section 06.2","Commercial duck rearing is possible but ducks entering jalmahal water can damage fish eggs, and a lessee may refuse entry: a practical conflict between two livelihood options.","PROFESSIONAL KII TESTIMONY","Trade-offs; excludability","Attributed; a conflict named, not quantified.","15 (notes)","7"],
["Q6-06","Q6",LEC,"00:05:02","'Plenty of food will not solve the problem! Plenty of food could be a problem.'","WORKSHOP LECTURE/SLIDE","Nonlinearity; self-organization","Illustrative teaching example (rabbit and carrots), not Tanguar evidence.","15","7"],
["Q6-07","Q6",LEC,"00:06:04","'We go to Tanguar Haor for one day, we become scientists that can solve the problem! ... And that's how development fails.'","WORKSHOP LECTURE/SLIDE","Reflexivity","Warrant for a reflection rather than a diagnosis.","2 (notes), 16","7"],
["Q6-08","Q6",LEC,"00:17:58-00:18:49","Only about one-third of an iceberg is visible; what you see in Tanguar Haor, even over five years, is one-third; this is a reason to stay engaged, not to withdraw.","WORKSHOP LECTURE/SLIDE","Emergence; uncertainty","Metaphor. The one-third is not a measured fraction of anything at Tanguar.","17","7"],
["Q6-09","Q6",LEC,"00:24:18","'Despite best engineering, a dam breaks - that's uncertainty.'","WORKSHOP LECTURE/SLIDE","Uncertainty","Applied by us to the embankment account.","5","2"],
["Q6-10","Q6",LEC,"00:31:11","'those who presented this morning, next time somebody else presents. Don't make it linear, make it non-linear!'","WORKSHOP FACILITATION","-","Presentation guidance, not field evidence. Supports the seven-speaker rotation.","-","-"],
]

QUOTES = [
["QA-01","“when the lessee was here, the lessee kept order, people could not take fish”",JOY,"00:27:21","আগে তো ইজারাদার যখন আছিল তখন তো ইজারাদার শাসন দিয়া রাখছে, মাছ মারতে পারছে নাredacted".replace("redacted","।"),"Translated from Bengali; lightly translated","Accurate","4","Original shown on slide above the translation."],
["QA-02","“the current net does not destroy fish”",JOY,"00:11:44","কারেন্ট জালে মাছ ধ্বংস করে না।","Translated from Bengali; lightly translated","Accurate","6","Context kept on the slide: he has used it since birth, for eating."],
["QA-03","“no, people from here, people of this very Tanguar”",JOY,"00:49:37","না এইখানের মানুষ, এই টাঙ্গুয়ারেরই মানুষ।","Translated from Bengali; lightly translated","Accurate","6","Answer to a direct question about shortgun and kona jal users."],
["QA-04","“they are uneducated people, they say we live by eating”",JOY,"00:33:00","তারা অশিক্ষিত মানুষ তারা কয় আমরা খাইয়া বাঁচি।","Translated from Bengali; lightly translated","Accurate","7","Speaker is reporting others' words, not confessing his own view."],
["QA-05","“no, we are getting a benefit from the houseboats … I am seeing cash profit”",JOY,"00:58:24","না হাউসবোট থেইকা সুবিধা তো আমরা একটা পাইতাছি … আমি তো নগদ লাভ দেখতাছি।","Translated from Bengali; lightly translated","Accurate; ellipsis marks omitted intervening clause","13","The omitted clause describes the tourists arriving."],
["QA-06","“right now we are surviving, that is fine, but for the future...”",JOY,"00:45:44","বর্তমানে তো বাঁচতাছি ঠিক আছে কিন্তু ভবিষ্যতের লাইগা তো...","Translated from Bengali; lightly translated","Accurate; the speaker does not finish the sentence","5","Shown unfinished, as spoken."],
["QA-07","“the hospital is at Tahirpur. In the monsoon it is death.”",JOY,"00:38:38","হাসপাতাল তো... তাহিরপুর। বর্ষাকালে মরণ।","Translated from Bengali; lightly translated","Accurate","9 (notes)","Elliptical in the original; rendered as two sentences."],
["QA-08","“not one person here has got it”",JOY,"00:54:51","না এইখানে একজনও পাইছে না।","Translated from Bengali; lightly translated","Accurate","11 (figure)","Refers to the family card in this settlement only."],
["QA-09","“it would be one kilometre. When we go we have to cross three rivers.”",JOY,"00:16:28","এক কিলো হবে। আমরা গেলে তিনটা নদী পার হইয়া যাওয়া লাগে।","Translated from Bengali; lightly translated","Accurate; repeated at 00:46:16","10","Set against the team's 4 km; neither figure adopted."],
["QA-10","“it is four kilometres away, they said you have to cross three rivers”",GRP,"00:04:01","৪ কিলোমিটার দূরে—বলছে তিনটা নদী পার হইয়া যাইতে হয়।","Translated from Bengali; lightly translated","Accurate as a quotation OF A TEAM MEMBER","10","Labelled on the slide as our group's words, not the community's."],
["QA-11","“When we asked him, you fish for three months … We steal, we drive a rickshaw”",GRP,"00:10:45","তিন মাস আপনি মাছ ধরেন, পরের তিন মাস কী করেন? ধান করি। আর পরের তিন মাস? চুরি করি, রিকশা চালাই।","Translated from Bengali; lightly translated","TEAM RECOLLECTION, not a community transcript line","8","Explicitly marked on the slide and in the notes as ours."],
["QA-12","“what we might think is a local problem is actually an interconnected problem”",LEC,"00:14:27","-","Spoken in English; transcribed, not translated","Accurate","6 (figure)","Original language English."],
["QA-13","“what you saw in Tanguar Haor, even if you go there for the next five years, what you will see is only one-third. Two-thirds you will never see.”",LEC,"00:18:20","-","Spoken in English; transcribed, not translated","Accurate","17","Metaphor; the fraction is not measured at Tanguar."],
["QA-14","“They brought a madrasa! That could be one element of self-organization.”",LEC,"00:11:33","-","Spoken in English; transcribed, not translated","Accurate","9 (figure)","Attributed to Prof. Nayak as a reading."],
["QA-15","“Plenty of food will not solve the problem! Plenty of food could be a problem.”",LEC,"00:05:02","-","Spoken in English; transcribed, not translated","Accurate","15","Teaching example, not Tanguar evidence."],
["QA-16","“the kanda is thin now; two or four more cuts and all of it becomes a mound”",JOY,"00:45:44","কান্দা তো অহনে ক্ষীণ হইছে আর দুই চারবার যদি কাটে এরপরে সবডা জাঙ্গাল হইয়া যাইব।","Translated from Bengali; lightly translated","Accurate","5 (figure)","Labelled 'translated' on the figure."],
["QA-17","“no, it does not run the whole year”",BOAT,"notes 18:56-20:11","না, সারা বছর চলে না।","Translated from Bengali; quoted via the audited note PDF","NOT verified against the audio by us","12","Audio exists (28:59) but no verified transcript. Flagged in preflight."],
["QA-18","REMOVED: ‘Now I can dry only three types of fish’","Candidate draft decks","-","-","-","NOT LOCATED in any supplied primary transcript","-","Removed from the deck. Do not reinstate without a traced source."],
["QA-19","REMOVED: ‘weaving prodips during Dipaboli’","Candidate draft decks","-","-","-","NOT LOCATED in any supplied primary transcript","-","Removed. May exist in material not yet provided."],
["QA-20","REMOVED: draft lines about the same haor giving unequal catches","Candidate draft decks","-","-","-","Not identifiable as verbatim in the supplied transcripts","-","Removed rather than presented as speech."],
["QA-21","“The village asked for it; CBRMP built it” — rendered WITHOUT quotation marks on the figure",JOY,"00:45:12","এই তো আমরা কওয়ার পরে তো সিবিআরএমপি এই বাঁধটা দিয়া গেছে।","Paraphrase","Downgraded from a quotation during the audit","5 (figure)","Quotation marks removed because the English is a paraphrase, not a close translation."],
]

PREFLIGHT = [
["P-01","UNRESOLVED FIGURE","School distance: about 1 km (Joypur 00:16:28, repeated 00:46:16) against 4 km (our group discussion 00:04:01), with one team member stating they did not hear the distance. Three river crossings are agreed in every account.","Both reported on slide 10. Neither adopted."],
["P-02","UNRESOLVED FIGURE","Village count: 82 (community, Joypur 00:35:08); 77 then 88 (CNRS KII Part 01, Q&A 1, the latter from the IUCN management plan).","All three reported. CNRS explains the gap as settlements not separately recorded; a village census is under way."],
["P-03","UNVERIFIED AUDIO","Boatman interview exists as original audio (20261108_125218.m4a, 28:59) plus audited notes. No verified transcript is available in this workspace and we cannot transcribe audio.","Every boatman-derived line is attributed to the note PDF and flagged. QA-17 is the only boatman quotation used."],
["P-04","AMBIGUOUS AUDIO","Boatman notes, section 09 (11:57-14:39), contain an incomplete sentence about poison. The notes themselves state it cannot be determined whether this is a question, an example or an event.","NOT USED anywhere in the deck. Must not be reinstated."],
["P-05","AMBIGUOUS AUDIO","Boatman notes record '400 blankets', a 1 lakh loan with 10,000 monthly instalments, and comments on power and injustice, all marked unclear or unverified in the notes.","NOT USED as figures. The general point about local awareness (15:10-17:25) is used in the rehearsal backup only."],
["P-06","SECOND-HAND CLAIM","Maternal death during transport (group discussion 00:06:35-00:06:55) and 2022 displacement to Netrokona (00:10:04).","Presented as second-hand group accounts, never as verified cases."],
["P-07","HYPOTHESIS ONLY","Association between turbid water and skin irritation or menstrual-hygiene discomfort (group discussion 00:07:14-00:08:08).","Carried in speaker notes as an interpretive hypothesis. No causal or medical claim is made."],
["P-08","DRAFT CLAIM NOT TRACED","'Now I can dry only three types of fish' (candidate decks).","Removed. Not located in any supplied primary transcript."],
["P-09","DRAFT CLAIM NOT TRACED","'Weaving prodips during Dipaboli' (candidate decks).","Removed. May exist in material not yet supplied."],
["P-10","PROHIBITED INFERENCE","141 historical fish species against 68 in recent catch monitoring (CNRS).","Both reported; the subtraction to 73 extinctions is explicitly refused on slide 14."],
["P-11","MATERIAL NOT SUPPLIED","Tourist-board member interview.","Not provided. Not reviewed. No claim in the deck depends on it."],
["P-12","MATERIAL NOT SUPPLIED","Team-wide field observation speech or transcript, if distinct from the basic-needs group discussion.","Not provided. Not reviewed."],
["P-13","MATERIAL NOT SUPPLIED","Remaining workshop decks beyond the three supplied PDFs.","Not provided. The six official questions are taken from Commons_Governance_SAU.pdf p. 1, which is the controlling source."],
["P-14","MATERIAL NOT SUPPLIED","The ten supplemental reading articles.","Not provided. Not reviewed. No literature claim is made in the deck."],
["P-15","MATERIAL NOT SUPPLIED","Approved field photographs.","None supplied. The deck uses no photographs and no placeholder captioned as a photograph. All visuals are conceptual figures generated from the sources."],
["P-16","ASSIGNMENT TO CONFIRM","Question 4 has no presenter in the announced allocation (Q1 one, Q2 one, Q3 two, Q5 two, Q6 one).","Speaker 5 bridges Q4 on slide 11 for about 65 seconds. This is OUR PROPOSAL and is flagged on the slide itself. It is not an instruction from the group."],
["P-17","ATTRIBUTION","CNRS statements throughout.","Treated as attributed professional testimony, never as independently established measurement."],
["P-18","ATTRIBUTION","No participant is named anywhere. Transcript speaker numbers are used only in the matrix, never on a slide.","Complied with."],
["P-19","TIMING","Spoken script measured at 3236 words across 17 slides. Per speaker: 3:35, 2:55, 2:55, 3:05, 2:50, 3:10, 3:40.","22:19 spoken at 145 wpm, plus about 48 s across six handoffs, giving 23:07 total. At 150 wpm it is 22:22; at 140 wpm, 23:54. Each speaker block sits within the 2.5 to 3.5 minute band, Speaker 7 five seconds over. Delivered slowly it reaches about 24 minutes, still inside 25."],
["P-20","LANGUAGE","Deck, figures, notes and rehearsal script are English only. Bengali appears only as the original of a translated quotation.","Complied with."],
["P-21","LIMIT OF SCOPE","One community group, one professional key informant, one boatman, one field day.","Stated on slide 1, in the opening script, and again in the close."],
["P-22","NOT INTERVIEWED","No woman was interviewed directly. Women's work and NGO loan arrangements are described by male participants and by our own group.","Named in the closing slide as a gap, not filled by inference."],
]

SOURCES = [
["S-01",SAU,"15 pages","PDF text extracted and read in full","Controlling source for the six official questions (p. 1) and for governance concepts."],
["S-02",N6,"27 pages","PDF text extracted and read in full","Excludability, subtractability, ephemeral commons, commonisation/decommonisation, V2V."],
["S-03",N8,"12 pages","PDF text extracted and read in full","SES, nonlinearity, uncertainty, self-organization, scale and levels, emergence."],
["S-04",LEC,"192 lines; English original plus Bengali translation","Read in full; English original used for all quotation","Original language English, so no translation label is needed for lecture quotes."],
["S-05",JOY,"469 lines; 01:00:04","Read in full, all four parts","Primary community testimony. Strongest source in the corpus."],
["S-06",GRP,"211 lines; 00:13:40","Read in full","GROUP INTERPRETATION source. Not evidence that the community said what the team summarises."],
["S-07",K1,"Parts 01 and 02 note PDFs","Text extracted and read in full","Professional key-informant testimony. Note PDFs state that no independent verification was added."],
["S-08",BOAT,"Note PDF; audio 28:59","Note PDF read in full; AUDIO NOT TRANSCRIBED","Dialect transcription declared unreliable by the notes themselves."],
["S-09","Tanguar_Haor_Presentation.pptx, V2.pptx, Tanguar_Haor_Presentation_4.pptx","18, 18 and 20 slides","Treated as ideation references only","No claim, quotation, number or label carried over without tracing to S-01 to S-08."],
["S-10","Superseded boatman drafts (KII Part 03 files)","2 HTML, 2 PDF","Not used","The archive README states the KII classification in these drafts was wrong. Final_Notes used instead."],
["S-11","Uploaded_Slide_List.jpg","1 image","Not used as evidence","Reference image only."],
]

def autosize(ws, widths):
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w

def style(ws, nrows, ncols, fill="1F4E5A"):
    hf = PatternFill("solid", fgColor=fill)
    thin = Side(style="thin", color="D8D4CC")
    bd = Border(left=thin, right=thin, top=thin, bottom=thin)
    for c in range(1, ncols + 1):
        cell = ws.cell(row=1, column=c)
        cell.font = Font(bold=True, color="FFFFFF", size=10)
        cell.fill = hf
        cell.alignment = Alignment(vertical="center", wrap_text=True)
    ws.row_dimensions[1].height = 30
    for r in range(2, nrows + 2):
        for c in range(1, ncols + 1):
            cell = ws.cell(row=r, column=c)
            cell.alignment = Alignment(vertical="top", wrap_text=True)
            cell.font = Font(size=9.5)
            cell.border = bd
    ws.freeze_panes = "A2"

wb = Workbook()

ws = wb.active; ws.title = "1 Evidence matrix"
ws.append(HDR)
for row in M: ws.append(row)
autosize(ws, [8, 6, 34, 20, 62, 24, 22, 38, 10, 9])
style(ws, len(M), len(HDR))

ws = wb.create_sheet("2 Quote audit")
QH = ["ID","Quotation as presented","Source file","Time or page","Original Bengali",
      "Translation status","Accuracy verdict","Slide","Note"]
ws.append(QH)
for row in QUOTES: ws.append(row)
autosize(ws, [8, 50, 34, 18, 46, 32, 34, 10, 42])
style(ws, len(QUOTES), len(QH), "7A3A22")

ws = wb.create_sheet("3 Preflight checklist")
PH = ["ID","Type","Issue","How it is handled"]
ws.append(PH)
for row in PREFLIGHT: ws.append(row)
autosize(ws, [8, 26, 72, 70])
style(ws, len(PREFLIGHT), len(PH), "8A5A1A")

ws = wb.create_sheet("4 Source inventory")
SH = ["ID","Source","Extent","How far we parsed it","Status and limits"]
ws.append(SH)
for row in SOURCES: ws.append(row)
autosize(ws, [8, 48, 34, 38, 58])
style(ws, len(SOURCES), len(SH), "3D5A3A")

ws = wb.create_sheet("5 Run of show")
RH = ["Slide","Speaker","Question","Target","Words","Est. at 145 wpm","Slide title"]
TITLES = {
1:"Tanguar Haor: a field reflection",2:"Four moves, repeated for each question",
3:"The same place is a different resource in every season",
4:"Excludability and subtractability do not hold still either",
5:"One structure, two opposite effects, both named by the same people",
6:"The problem does not sit at one level, and the blame does not sit outside",
7:"Food and income: the exposure is seasonal, not general",
8:"The thing that holds people here is the thing that exposes them",
9:"Provision exists. Use is another question.",
10:"One number we will not quietly choose for you",
11:"Custody and ownership are not in the same hands  [Q4 bridge, to confirm]",
12:"We can evidence coping. We cannot evidence a transition.",
13:"We went in with a hypothesis about tourism. It was refused.",
14:"What we would need before we used the word transition",
15:"Three futures the evidence allows, and who would have to act in each",
16:"We can now ask for whom, at which level, and over how long",
17:"What changed in what we notice",
}
QMAP = {1:"Opening",2:"Method",3:"Q1",4:"Q1",5:"Q2",6:"Q2",7:"Q3",8:"Q3",9:"Q3",10:"Q3",
        11:"Q4 bridge",12:"Q5",13:"Q5",14:"Q5",15:"Q6",16:"Q6",17:"Close"}
import sys
sys.path.insert(0, HERE)
from script import SPOKEN, RUN
ws.append(RH)
tw = 0; tsec = 0
for n, sp, t in RUN:
    w = len(SPOKEN[n].split()); tw += w
    est = w / 145 * 60; tsec += est
    ws.append([n, f"Speaker {sp}", QMAP[n], f"{t//60}:{t%60:02d}", w,
               f"{int(est)//60}:{int(est)%60:02d}", TITLES[n]])
ws.append(["", "", "TOTAL", "", tw, f"{int(tsec)//60}:{int(tsec)%60:02d}",
           f"plus about 48 s of handoff pauses = {int(tsec+48)//60}:{int(tsec+48)%60:02d}"])
autosize(ws, [8, 12, 14, 10, 9, 16, 70])
style(ws, len(RUN) + 1, len(RH), "4A4A5A")

xp = os.path.join(OUT, "Evidence_Matrix_and_Quote_Audit.xlsx")
wb.save(xp)

with open(os.path.join(OUT, "Evidence_Matrix_and_Quote_Audit.csv"), "w",
          newline="", encoding="utf-8-sig") as f:
    w = csv.writer(f)
    w.writerow(["# SHEET 1: EVIDENCE MATRIX"]); w.writerow(HDR); w.writerows(M)
    w.writerow([]); w.writerow(["# SHEET 2: QUOTE AUDIT"]); w.writerow(QH); w.writerows(QUOTES)
    w.writerow([]); w.writerow(["# SHEET 3: PREFLIGHT CHECKLIST"]); w.writerow(PH); w.writerows(PREFLIGHT)
    w.writerow([]); w.writerow(["# SHEET 4: SOURCE INVENTORY"]); w.writerow(SH); w.writerows(SOURCES)

print("rows: matrix", len(M), "quotes", len(QUOTES), "preflight", len(PREFLIGHT),
      "sources", len(SOURCES))
print("saved", xp)

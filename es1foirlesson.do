clear all
cap cd "C:\Users\tonio\OneDrive - Università di Napoli Federico II\Dott_drive\Lezioni_econometria\Esercitazioni_Anto\2025\es1\es1" 
pwd
import delimited TableI_1.csv, clear 
save data.dta , replace 
use data , replace
*DATA description
describe

label variable pcey "Personal Consumption Expenditure" 
label variable gdpx "Gross Domestic Product"

summarize gdpx
generate delta_gdpx = (gdpx - gdpx[_n-1])
generate delta_pcey = (pcey-pcey[_n-1]) 
gen MPC =  delta_pcey / delta_gdpx
summarize MPC
ttest mpc == 0
scatter mpc year

ghjk
correlate pcey gdpx 

generate deltag = (gdpx - gdpx[_n-1])

gen dc = (pcey - pcey[_n-1])
sum dg dc

gen mpc = dc /dg
sum mpc
graph twoway (lfit pcey gdpx) (scatter pcey gdpx),  leg(off)  





summarize delta_gdpx delta_pcey


save data , replace


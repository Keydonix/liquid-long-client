# Meeting 11th August 2018  
by upWork communication module  
participants: Scott Bigelow, Alex Novikov  
  
__Given values to use for the application, receive from outside the application:__
* User Entered values:
  * Leverage Size (minimum: 1.05x, maximum: 3x)
  * Leverage Amount (minimum: 0.01; maximum=500) - maybe should be dynamic and goes from middleware
  * Service Fee (minimum: 0; maximum: 25) - it should go from middleware: default
    * minimum is 0 (how can it be bellow Service fee - ???). Price does not go from the market (oficial price feed) but from the system (mkr.tools which could have +- 1% of the difference with the market).
    * should be dynamic basic on size of CDP and a value;
* Automatically received values:
  * Price - from middleware (mkr.tools)
  * Service fee - is fixed based on loan
  * Exchange cost - (service cost - is price we pay for the transaction)

__Values of the Confirm panel (in the bottom of the screen with "Confirm Transaction" button):__
* Total price = entered Leverage Amount + equals Service Fee + Exchange cost = deduction from the MetaMask wallet;
* Leverage Amount = entered Leverage Amount
* Service Fee = part of the entered Service Fee;
* Exchange cost = part of the entered Service Fee;
https://projects.invisionapp.com/share/YXN3PV5E53Z#/screens/309324138

Price could be updated every 15 seconds as ETH network transaction frequency but in reallity it updates no often that ones per 2 minutes;  
Liquidation price:  
if we have leverage = 3, then Liquidation Price is equal to current ETH price.

CDP - ownership of the smart contract 0,2 ETH as a fee for example.

__Info panel (on the right hand side):__
* Current ETH price
* Liquidation price
* Current Portfolio Value - should we show it ???
Grid legend:
* Price to gain +100%; +$107,500; $215,000 of your money ( = Current Portfolio Value * 2)
* Price to gain + 50%; +$53,750; $161,250 of your money (= Current Portfolio Value * 1.5)
* Price to gain + 0%; +$0; $107,500 of your money (= Current Portfolio Value)
* Price to lose -50%; -$26,875; $80,625 if you close your position by yourself or lose -65%; -$34,937; $72,563 if you would force closed.
    * = Current Portfolio Value * 0,25 ??? (should be * 0,5)

The links:  
https://dai.makerdao.com/  
https://www.npmjs.com/package/@keydonix/liquid-long-client-library  
https://mkr.tools/system/feeds - we are taking all prices from here.  

##### Example 1:
ETH Price now is 323.  
Leverage is 1.  
Amount is 10.  
Does not make sense.  
##### Example 2:
ETH Price now is 323.  
Leverage is 2.  
Amount is 10.  
Fee: 3  
Total PRICE = 10+3= 13  
Liquidation price = 242,25  
...
##### Example 3:
ETH Price now is 323.  
Leverage is 2.  
Amount is 1.  
Fee: 3.  
Total PRICE = 1+3= 4  
Liquidation price = 242,25 (it is only related to the ETH price and leverage).  
323 - Debt. I will pay 323*2=646.  
(1.5 - 1.5/2) * 323 = 242.25  
242,25 * 2 = 484,5 / 323 = 1,5 is a magic number. I need 50% overcollarization. If I have less I could be margin called.  
Price to gain 100% = 323 + ...  
Price to gain 50% = 323 + ...  


##### Questions to discover after a meeting:
1) [ X ] What is the minimum for the enter Service Fee field? (0 or 0.05 like in design)?
2) [ X ] Should we break down fee+cost inside confirm panel? And the term for summ of it.
    - Both of these are answered together. 
there was a change that wasn't reflected in that mock, sorry. 
That slider is ONLY exchange cost. Service fee is outlined in tooltip AND 
is the only thing listed in the "including service fee" at bottom"
3) [ X ] Should we show Current Portfolio Value inside info panel? Design has both variants.
    - No. Old design
4) [  ] What the User should see after transaction succeed or failed? (*)
    - "What to do while transaction in flight?" - spinner on confirm button  
5) [  ] What will be the tooltip text for the three question marks (at the enter leverage field, enter amount field and enter fee field)?
    - TBD  
    - for tooltips, we coudl pull something from https://help.keydonix.com  
6) [  ] The design source should be provided by the designer;
    - Monday, cleanup to be done on their end  
  
When the user press "Confirm Transaction" button he will see spinner [like this one](https://projects.invisionapp.com/share/YXN3PV5E53Z#/screens/309324137) 
and application will send the transaction to the network using middleware. 
Depending on the return status the User will see ["Transaction Successful!" 
screen](https://projects.invisionapp.com/share/YXN3PV5E53Z#/screens/309324135) or 
["Something went wrong" screen](https://projects.invisionapp.com/share/YXN3PV5E53Z#/screens/309324135). 
So the links which will be on these pages should be provided.  
  
  
The __next meeting__ is tentatively scheduled for tomorrow, 12th August 2018, __1pm PDT__.  
  
  
  
  
  
  
  
  
  
  
  
  
  

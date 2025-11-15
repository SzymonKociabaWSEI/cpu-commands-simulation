Procesor 8086 to 16-bitowy mikroprocesor wprowadzony na rynek w 1978 roku.
Został zaprojektowany przez firmę Intel jako rozszerzenie 8-bitowego procesora 8080/8085.
Jest to pierwszy procesor, który znalazł szerokie zastosowanie w komputerach osobistych
(np. IBM PC).

Procesor 8086 wyróżniał się: 
- przestrzenią adresową pamięci - 1 MB w trybie rzeczywistym
- przestrzenią adresową urządzeń I/O - 64kB
- 16-bitową magistralą danych
- 20-bitową magistralą adresową
- częstotliwością do 10MHz
- ilością rozkazów (w podstawie aż 91)
- 16-bitową jednostką arytmetyczno-logiczną
- 16-bitowymi rejestrami ogólnego przeznaczenia
- 6-bitową kolejką rozkazów

W porównaniu do mikroprocesorów 8-bitowych, 16-bitowy 8086 został wzbogacony o dodatkowe trzy rejestry: 
- indeksowe (2)
- wskaźnikowe (2)
- bazowy (1)
Wspomniane rejestry omówione są niżej.

Wspomniany procesor został wzbogacony o mechanizm segmentacji. Zawiera cztery rejestry segmentowe. Zawartości tych rejestrów wraz z adresem efektywnym stonowią adres fizyczny pamięci. Taki sposób adresowania ułatwia relokację programów i danych oraz umożliwia stworzenie prostego mechanizmu zarządzania pamięcią.
By przyspieszyć pracę, czyli wykonywanie przez procesor rozkazów, firma Intel stworzyła dwie osobne jednostki: wykonawczą oraz interfejsową. Jednostka wykonawcza odpowiedzialna jest za dekodowanie i wykonywanie operacji. Jednostka interfejsowa odpowiada z kolei za współpracę z pamięcią. Dzięki takiej architekturze 8086 jest w stanie jednocześnie wykonywać operację jednego rozkazu oraz pobierać kod operacji następnego.

Ze względu na posiadaną 20-bitową magistralę adresową procesor 8086 ma możliwość zaadresowania do 1 MB pamięci operacyjnej. Przestrzeń adresowa została podzielona na egmenty o długości 64kB, rozpoczynające się co 16 bajtów. Adres fizyczny komórek pamięci obliczany jest na podstawie dwóch 16-bitowych składników, którymi są adres segmentu oraz adres efektywnego przesunięcia. Taki sposób adresowania nazywa się adresowaniem segmentowym.

Adresy logiczne zawierają dwie składowe (mówimy, że adres jest dwuwymiarowy), określające
segment (adres bazowy segmentu) oraz odległość (przesunięcie – ang. offset) od początku
segmentu.
Użytkownik (programista) odwołuje się do obiektów w programie za pomocą adresu
dwuwymiarowego, podczas gdy pamięć fizyczna jest jednowymiarowym ciągiem bajtów. Na
zewnętrzną magistralę adresową procesora są wystawiane adresy fizyczne, ale wewnątrz
procesora adresy są reprezentowane w sposób logiczny: segment oraz offset.
Przez tryb adresowania rozumiemy sposób wyznaczania adresu argumentu lub wyniku
operacji. Adres ten jest określony mianem adresu efektywnego i oznacza offset w segmencie
danych. Adres bazowy segmentu jest natomiast określony przez odpowiedni rejestr segmentowy
(domyślny lub narzucony przez prefiks).

Adresowanie natychmiastowe
Argument operacji jest zapisany w rozkazie (rozkazy z argumentem bezpośrednim).
Pole adresowe zawiera bezpośrednio operand (ang. operand) czyli daną dla rozkazu. Długość
operandu zależy od kodu operacji lub od kodu operacji i dodatkowego pola sterującego w
rozkazie. Ten tryb adresowania stosujemy, gdy np. chcemy bezpośrednio z rozkazu (bez
odwoływania się do pamięci) załadować do rejestru prostą daną - bajt lub parę bajtów.

Adresowanie bezpośrednie
Jest najbardziej podstawowym trybem adresowania. W tym trybie zawartość pola adresowego stanowi już finalny adres argumentu rozkazu w pamięci operacyjnej i nie podlega przekształceniu.
Cechuje się tym, że w rozkazie jest zapisany adres (offset) argumentu, np. gdy w segmencie
danych zdefiniowano następujące dane: "A DB 100" oraz "B DW 1000", przesłanie danej B do rejestru AX jest wykonywane rozkazem MOV AX, B lub MOV AX, [B].
Nazwa B pełni tu funkcję adresu. To samo można uzyskać podając offset dla zmiennej B = 1
(zmienna A ma offset = 0), a ponieważ jest zmienną bajtową, więc następna zmienna B ma
offset =1). MOV AX, [DS:1].

Adresowanie rejestrowe
To w gruncie rzeczy adresowaniem bezpośrednim, z tym że pole adresu (zwykle bardzo krótkie) adresuje tylko adresy wewnętrzne procesora.

Adresowanie pośrednie
W adresowaniu pośrednim rozkaz zawiera adres komórki pamięci operacyjnej, w której
zawarty jest finalny adres operandu rozkazu. W tym przypadku komórka pamięci wskazana
przez adres rozkazu pośredniczy w określeniu finalnego adresu.

Adresowanie indeksowe
To inaczej modyfikacja adresu przez indeksowanie. W tym trybie wykorzystuje się specjalne rejestry procesora tzw. rejestry indeksowe (ang. index registers), które zawierają przesunięcie, który trzeba dodać do adresu istniejącego w rozkazie aby wyliczyć adres finalny operandu.

Adresowanie względne
Adresowanie względne polega na modyfikacji adresu zawartego w rozkazie przez aktualną
zawartość licznika rozkazów. Przy tym trybie adresowania, finalny adres danej jest
wyliczany względem bieżącej zawartości licznika rozkazów, a więc do rozkazu
wstawiamy przesunięcie danej w programie względem adresu następnego rozkazu, np.
n komórek w przód lub w tył.

Adresowaneie pośrednie indeksowe
Zapewnia jednoczesną możliwość zastosowania w programie adresowania pośredniego z modyfikacją adresu odczytanego z komórki pośredniczącej poprzez zawartość rejestru indeksowego. Umieszczony w rozkazie adres wskazuje na komórkę przechowującą adres danej, który może być tam wstawiany dynamicznie jako wynik obliczeń programu. Do tego adresu stosowane jest następnie indeksowanie poprzez zawartość rejestru indeksowego. Zawartość rejestru indeksowego może też być wstawiona dynamicznie w wyniku działania innej części programu.

Adresowanie indeksowe pośrednie
Zapewnia najpierw modyfikację adresu zawartego w rozkazie przez zawartość rejestru indeksowego a następnie tak otrzymany adres jest stosowany do wskazania komórki pamięci, w której jest przechowywany finalny adres operandu rozkazu.
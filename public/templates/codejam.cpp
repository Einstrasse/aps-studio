#include <bits/stdc++.h>
using namespace std;
#define endl '\n'
typedef long long ll;
typedef pair<int, int> pii;
int gcd(int a, int b)
{
	int c;
	while (a != 0) {
		c = a; a = b % a;  b = c;
	}
	return b;
}

void solve() {
	return;
}
int main() {
	int tc;
	cin >> tc;
	for (int t = 1; t <= tc; t++) {
		cout << "Case #" << t << ": ";
		solve();
	}
}

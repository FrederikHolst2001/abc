import React, { useState } from 'react';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const currencies = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
];

const rates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 154.32,
  CHF: 0.88,
  AUD: 1.53,
  CAD: 1.36,
  NZD: 1.67,
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [isConverting, setIsConverting] = useState(false);

  const convertedAmount = ((parseFloat(amount) || 0) / rates[fromCurrency]) * rates[toCurrency];

  const handleSwap = () => {
    setIsConverting(true);
    setTimeout(() => {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
      setIsConverting(false);
    }, 300);
  };

  const getRate = () => {
    return (rates[toCurrency] / rates[fromCurrency]).toFixed(5);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-blue-400" />
          Currency Converter
        </h2>
        <div className="text-xs text-slate-500">
          Live rates
        </div>
      </div>

      <div className="space-y-4">
        {/* From Currency */}
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-xs text-slate-500 mb-2">From</div>
          <div className="flex items-center gap-3">
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {currencies.map((currency) => (
                  <SelectItem
                    key={currency.code}
                    value={currency.code}
                    className="text-white hover:bg-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <span>{currency.code}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent border-none text-2xl font-mono text-white text-right focus-visible:ring-0 p-0"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: isConverting ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwap}
              className="rounded-full bg-slate-700 hover:bg-slate-600 text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* To Currency */}
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-xs text-slate-500 mb-2">To</div>
          <div className="flex items-center gap-3">
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {currencies.map((currency) => (
                  <SelectItem
                    key={currency.code}
                    value={currency.code}
                    className="text-white hover:bg-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <span>{currency.code}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <motion.div
              key={convertedAmount}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 text-2xl font-mono text-emerald-400 text-right"
            >
              {convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.div>
          </div>
        </div>

        {/* Exchange Rate */}
        <div className="text-center pt-2">
          <div className="text-xs text-slate-500">
            1 {fromCurrency} = <span className="text-white font-mono">{getRate()}</span> {toCurrency}
          </div>
        </div>
      </div>
    </div>
  );
}
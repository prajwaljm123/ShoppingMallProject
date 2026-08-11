package com.cg.smms.service;

import com.cg.smms.entities.Mall;
import java.util.List;

public interface MallService {
    Mall addMall(Mall mall);
    Mall updateMall(Mall mall);
    Mall getMall(Long id);
    List<Mall> getAllMalls();
}